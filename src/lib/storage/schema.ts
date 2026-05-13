export interface TrackedAppliance {
  name: string; watts: number; hrs: number; days: number; weeks: number; qty: number; cost: number; kwh: number;
}

export interface NotificationItem {
  type: "warn" | "info" | "good";
  title: string; desc: string; time: string;
}

export interface MonthData {
  name: string; bill: number; kwh: number; change: number; insight: string;
}

export interface TimelineEntry {
  text: string; date: string; type: "warn" | "info" | "good";
}

export interface Achievement {
  label: string; desc: string;
}

export interface SmartDevice {
  name: string; watts: number; cost: string; daily: string; status: "ON" | "OFF"; rating: string; health: number; suggestion: string;
}

export interface AutomationRule {
  label: string; active: boolean;
}

export interface AppEnergyData {
  estimatedBill: number;
  lastMonthBill: number;
  currentUsage: number;
  budgetTotal: number;
  budgetLeft: number;
  savings: number;
  savingsPct: number;
  energyScore: number;
  scoreEfficiency: number;
  scoreBudget: number;
  scorePeak: number;
  dailyAverage: number;
  daysElapsed: number;
  lastMonthKwh: number;
  dailyData: number[];
  weeklyData: number[];
  prevWeek: number[];
  peakHours: number[];
  predictedBill: number;
  totalSavingsYear: number;
  avgBill: number;
  lowestMonth: number;
  lowestMonthLabel: string;
  highestMonth: number;
  highestMonthLabel: string;
  months: MonthData[];
  timeline: TimelineEntry[];
  achievements: Achievement[];
  monthlyData: number[];
  notifications: NotificationItem[];
  liveCost: number;
  liveKw: number;
  projectedDaily: number;
  smartDevices: SmartDevice[];
  automationRules: AutomationRule[];
  userName: string;
}

export interface AppData {
  energy: AppEnergyData;
  trackedAppliances: TrackedAppliance[];
  onboardingComplete: boolean;
  hasSeeded: boolean;
  version: number;
}
