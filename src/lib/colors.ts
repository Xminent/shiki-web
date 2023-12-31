export interface Colors {
	// pageBackground: string
	selectLabel: string;
	selectButton: string;
	selectIcon: string;
	dropdownList: string;
	dropdownHover: string;
	textActive: string;
	iconActiveStroke: string;
	iconActiveFill: string;
	iconActiveShade: string;
	iconStroke: string;
	iconFill: string;
}

export const defaultColors = {
	// pageBackground: 'bg-slate-50 dark:bg-slate-900',
	selectLabel: 'text-slate-700 dark:text-slate-500',
	selectButton:
		'ring-1 ring-slate-900/10 rounded-lg shadow-sm p-2 text-slate-700  bg-white dark:bg-slate-600 dark:ring-0 dark:highlight-white/5 dark:text-slate-200',
	selectIcon: 'text-slate-400',
	dropdownList:
		'text-slate-700 bg-white ring-1 ring-black ring-opacity-5 dark:bg-slate-700 dark:ring-0 dark:highlight-white/5 dark:text-slate-300',
	dropdownHover: 'hover:bg-slate-50 hover:dark:bg-slate-800/50',
	textActive: 'text-indigo-500',
	iconActiveStroke: 'stroke-indigo-500',
	iconActiveFill: 'fill-indigo-500',
	iconActiveShade: 'fill-indigo-400/20',
	iconStroke: 'stroke-slate-400',
	iconFill: 'fill-slate-400'
};
