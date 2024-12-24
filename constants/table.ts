type Views = {
	[key: string]: {
		name: string;
		key: string;
	};
};

export const views: Views = {
	all: {
		name: 'All',
		key: 'all',
	},
	thisWeek: {
		name: 'This Week',
		key: 'thisWeek',
	},
	thisMonth: {
		name: 'This Month',
		key: 'thisMonth',
	},
	pastWeek: {
		name: 'Past Week',
		key: 'pastWeek',
	},
	pastMonth: {
		name: 'Past Month',
		key: 'pastMonth',
	},
};

import { Banknote, CreditCard, Landmark, Nfc } from "lucide-react"

export const modes = [
  {
    value: "card",
    label: "Card",
    icon: CreditCard,
  },
  {
    value: "cash",
    label: "Cash",
    icon: Banknote,
  },
  {
    value: "online",
    label: "Online",
    icon: Nfc,
  },
  {
    value: "cheque",
    label: "Cheque",
    icon: Landmark,
  },
]

export const dealers = [
  { label: "Luggage king", value: "idr" },
  { label: "Goodwin", value: "gwd" },
  { label: "Legon bag", value: "lgb" },
  { label: "Fly bag", value: "fly" },
  { label: "Zabco bag", value: "zab" },
  { label: "Market", value: "mar" },
  { label: "Peri bag", value: "per" },
  { label: "Dubbly bag", value: "sur" },
  { label: "Fast Fashion", value: "ffb" },
  { label: "Cherry Bag", value: "chb" },
  { label: "Originals Bag", value: "ogb" },
  { label: "Jiore Bag", value: "jib" },
]