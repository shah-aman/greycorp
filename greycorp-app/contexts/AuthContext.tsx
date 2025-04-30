import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '@/types'; // Import the Transaction type
import uuid from 'react-native-uuid'; // Need a way to generate unique IDs

interface Investments {
  [fundId: string]: number; // Tracks amount invested per fund
}

interface AuthState {
  isAuthenticated: boolean;
  balance: number;
  username: string | null;
  investments: Investments;
  transactions: Transaction[];
  isLoading: boolean; // Added isLoading state
}

interface AuthContextProps extends Omit<AuthState, 'investments' | 'transactions' | 'isLoading'> {
  login: (username: string) => Promise<void>;
  signup: (username: string) => Promise<void>;
  logout: () => Promise<void>;
  deposit: (amount: number) => Promise<void>;
  invest: (fundId: string, fundName: string, amount: number) => Promise<boolean>; 
  getFundInvestment: (fundId: string) => number;
  getTransactions: () => Transaction[];
  isLoading: boolean; // Expose isLoading
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const USER_KEY = '@auth_user';
const BALANCE_KEY = '@user_balance';
const INVESTMENTS_KEY = '@user_investments';
const TRANSACTIONS_KEY = '@user_transactions';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    balance: 0,
    username: null,
    investments: {},
    transactions: [],
    isLoading: true, // Start loading
  });

  // Load state from storage
  useEffect(() => {
    const loadAuthState = async () => {
      let loadedState: Partial<AuthState> = {};
      try {
        const storedUsername = await AsyncStorage.getItem(USER_KEY);
        const storedBalance = await AsyncStorage.getItem(BALANCE_KEY);
        const storedInvestments = await AsyncStorage.getItem(INVESTMENTS_KEY);
        const storedTransactions = await AsyncStorage.getItem(TRANSACTIONS_KEY);
        
        loadedState = {
          isAuthenticated: !!storedUsername,
          username: storedUsername,
          balance: storedBalance ? parseFloat(storedBalance) : 0,
          investments: storedInvestments ? JSON.parse(storedInvestments) : {},
          transactions: storedTransactions ? JSON.parse(storedTransactions) : [],
        };
      } catch (e) {
        console.error("Failed to load auth state:", e);
        // Set default state on error
        loadedState = { isAuthenticated: false, balance: 0, username: null, investments: {}, transactions: [] };
      } finally {
        // Combine initial state load with setting loading to false
        setAuthState(prev => ({ ...prev, ...loadedState, isLoading: false })); 
      }
    };
    loadAuthState();
  }, []);

  // Helper to update state and storage
  const updateStateAndStorage = async (updates: Partial<Omit<AuthState, 'isLoading'>>) => {
    // Update state first, keeping isLoading as is unless explicitly changed
    const newState = { ...authState, ...updates };
    setAuthState(newState);
    try {
      // Persist relevant parts to storage
      if (updates.balance !== undefined) await AsyncStorage.setItem(BALANCE_KEY, updates.balance.toString());
      if (updates.investments !== undefined) await AsyncStorage.setItem(INVESTMENTS_KEY, JSON.stringify(updates.investments));
      if (updates.transactions !== undefined) await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updates.transactions));
      if (updates.username !== undefined) await AsyncStorage.setItem(USER_KEY, updates.username || '');
      if (updates.isAuthenticated === false && authState.isAuthenticated === true) {
        // Clear storage only on actual logout transition
        await AsyncStorage.removeItem(USER_KEY);
        await AsyncStorage.removeItem(BALANCE_KEY);
        await AsyncStorage.removeItem(INVESTMENTS_KEY);
        await AsyncStorage.removeItem(TRANSACTIONS_KEY);
      }
    } catch (e) {
      console.error("Failed to update storage:", e);
    }
  };

  const login = async (username: string) => {
     const storedBalance = await AsyncStorage.getItem(BALANCE_KEY);
     const storedInvestments = await AsyncStorage.getItem(INVESTMENTS_KEY);
     const storedTransactions = await AsyncStorage.getItem(TRANSACTIONS_KEY);
     await updateStateAndStorage({
         isAuthenticated: true,
         username,
         balance: storedBalance ? parseFloat(storedBalance) : 0,
         investments: storedInvestments ? JSON.parse(storedInvestments) : {},
         transactions: storedTransactions ? JSON.parse(storedTransactions) : [],
     });
  };

  const signup = async (username: string) => {
    // Clear potential previous user data for a fresh start
    await AsyncStorage.removeItem(BALANCE_KEY);
    await AsyncStorage.removeItem(INVESTMENTS_KEY);
    await AsyncStorage.removeItem(TRANSACTIONS_KEY);
    await updateStateAndStorage({ 
        isAuthenticated: true, 
        balance: 0, 
        username, 
        investments: {}, 
        transactions: [] 
    });
  };

  const logout = async () => {
    await updateStateAndStorage({ 
        isAuthenticated: false, 
        balance: 0, // Reset balance on logout
        username: null, 
        investments: {}, 
        transactions: [] 
    });
    // Clear all keys related to the user explicitly
    await AsyncStorage.removeItem(BALANCE_KEY);
    await AsyncStorage.removeItem(INVESTMENTS_KEY);
    await AsyncStorage.removeItem(TRANSACTIONS_KEY);
  };
  
  const deposit = async (amount: number) => {
    if (!authState.isAuthenticated || amount <= 0) return;
    const newBalance = authState.balance + amount;
    const newTransaction: Transaction = {
      id: uuid.v4() as string,
      type: 'deposit',
      amount: amount,
      date: new Date().toISOString(),
      description: 'Wallet deposit',
    };
    const newTransactions = [newTransaction, ...authState.transactions];
    await updateStateAndStorage({ balance: newBalance, transactions: newTransactions });
  };

  const invest = async (fundId: string, fundName: string, amount: number) => {
    if (!authState.isAuthenticated || amount <= 0 || authState.balance < amount) {
        console.log("Investment failed: Insufficient balance or invalid amount.");
        return false;
    }
    const newBalance = authState.balance - amount;
    const currentInvestment = authState.investments[fundId] || 0;
    const newInvestments = { 
      ...authState.investments, 
      [fundId]: currentInvestment + amount 
    };
    const newTransaction: Transaction = {
      id: uuid.v4() as string,
      type: 'investment',
      amount: amount,
      date: new Date().toISOString(),
      fundName: fundName,
      description: `Investment in ${fundName}`,
    };
    const newTransactions = [newTransaction, ...authState.transactions];
    
    try {
      await updateStateAndStorage({ 
          balance: newBalance, 
          investments: newInvestments, 
          transactions: newTransactions 
      });
      console.log(`Successfully invested ${amount} in ${fundName}. New balance: ${newBalance}`);
      return true;
    } catch (e) {
      console.error("Investment failed during state update:", e);
      // No automatic rollback here, assumes updateStateAndStorage handles storage errors
      return false;
    }
  };

  const getFundInvestment = (fundId: string) => {
      return authState.investments[fundId] || 0;
  };

  const getTransactions = () => {
      // Return a copy to prevent direct mutation
      return [...authState.transactions];
  };

  return (
    <AuthContext.Provider value={{ 
        isAuthenticated: authState.isAuthenticated,
        balance: authState.balance,
        username: authState.username,
        login, 
        signup, 
        logout, 
        deposit, 
        invest, 
        getFundInvestment,
        getTransactions,
        isLoading: authState.isLoading // Expose isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 