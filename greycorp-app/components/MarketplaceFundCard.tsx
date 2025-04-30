import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Fonts from '@/constants/Fonts';
import Layout from '@/constants/Layout';

interface MarketplaceFundCardProps {
  fund: {
    id: string;
    name: string;
    description: string;
    apy: number;
    minInvestment: number;
    risk: number;
    category: string;
    themeColor: string;
  };
}

export function MarketplaceFundCard({ fund }: MarketplaceFundCardProps) {
  const handlePress = () => {
    router.push(`/fund/${fund.id}`);
  };
  
  // Risk indicator dots
  const renderRiskDots = () => {
    const dots = [];
    for (let i = 1; i <= 5; i++) {
      dots.push(
        <View
          key={i}
          style={[
            styles.riskDot,
            i <= fund.risk ? { backgroundColor: Colors.text } : { backgroundColor: Colors.textLight, opacity: 0.3 },
          ]}
        />
      );
    }
    return dots;
  };
  
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={[styles.colorBar, { backgroundColor: fund.themeColor }]}>
        <View style={styles.apyBadge}>
          <Text style={styles.apyText}>{(fund.apy * 100).toFixed(1)}% APY</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{fund.name}</Text>
        <Text style={styles.description}>{fund.description}</Text>
        
        <View style={styles.footer}>
          <View style={styles.details}>
            <Text style={styles.detailText}>Min: ${fund.minInvestment.toLocaleString()}</Text>
            <View style={styles.separator} />
            <Text style={styles.detailText}>{fund.category}</Text>
          </View>
          
          <View style={styles.riskContainer}>
            <Text style={styles.riskLabel}>Risk:</Text>
            <View style={styles.riskDots}>
              {renderRiskDots()}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.bg,
    borderRadius: Layout.radii.md,
    marginBottom: Layout.spacing * 5,
    ...Layout.shadow.md,
    overflow: 'hidden',
  },
  colorBar: {
    width: 12,
    borderTopLeftRadius: Layout.radii.md,
    borderBottomLeftRadius: Layout.radii.md,
  },
  apyBadge: {
    position: 'absolute',
    top: Layout.spacing * 4,
    backgroundColor: Colors.bg,
    paddingVertical: Layout.spacing,
    paddingHorizontal: Layout.spacing * 2,
    borderTopRightRadius: Layout.radii.sm,
    borderBottomRightRadius: Layout.radii.sm,
    ...Layout.shadow.md,
  },
  apyText: {
    ...Fonts.caption,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: Layout.spacing * 4,
  },
  title: {
    ...Fonts.h3,
    marginBottom: Layout.spacing * 2,
  },
  description: {
    ...Fonts.body,
    color: Colors.textLight,
    marginBottom: Layout.spacing * 4,
  },
  footer: {
    marginTop: 'auto',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing * 3,
  },
  detailText: {
    ...Fonts.caption,
    color: Colors.textLight,
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textLight,
    marginHorizontal: Layout.spacing * 2,
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskLabel: {
    ...Fonts.caption,
    marginRight: Layout.spacing * 2,
  },
  riskDots: {
    flexDirection: 'row',
  },
  riskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Layout.spacing,
  },
});