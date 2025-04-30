import { View, Text, StyleSheet } from 'react-native';
import { ArrowDownLeft, ArrowUpRight, Percent } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

interface TransactionProps {
  transaction: {
    id: string;
    type: 'deposit' | 'withdrawal' | 'interest';
    amount: number;
    fundName: string;
    date: string;
  };
}

export function TransactionItem({ transaction }: TransactionProps) {
  const { type, amount, fundName, date } = transaction;
  
  const getIcon = () => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft color={Colors.secondary} size={24} />;
      case 'withdrawal':
        return <ArrowUpRight color={Colors.danger} size={24} />;
      case 'interest':
        return <Percent color={Colors.primary} size={24} />;
      default:
        return null;
    }
  };
  
  const getTitle = () => {
    switch (type) {
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      case 'interest':
        return 'Interest Payment';
      default:
        return '';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      
      <View style={styles.details}>
        <Text style={styles.title}>{getTitle()}</Text>
        <Text style={styles.fundName}>{fundName}</Text>
      </View>
      
      <View style={styles.rightContent}>
        <Text style={[
          styles.amount,
          type === 'withdrawal' ? styles.negative : styles.positive
        ]}>
          {type === 'withdrawal' ? '-' : '+'}${amount.toFixed(2)}
        </Text>
        <Text style={styles.date}>{formatDate(date)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing * 3,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bgAlt,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing * 3,
  },
  details: {
    flex: 1,
  },
  title: {
    ...Fonts.body,
    fontWeight: '600',
    marginBottom: Layout.spacing,
  },
  fundName: {
    ...Fonts.caption,
    color: Colors.textLight,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    ...Fonts.body,
    fontWeight: '600',
    marginBottom: Layout.spacing,
  },
  positive: {
    color: Colors.secondary,
  },
  negative: {
    color: Colors.danger,
  },
  date: {
    ...Fonts.caption,
    color: Colors.textLight,
  },
});