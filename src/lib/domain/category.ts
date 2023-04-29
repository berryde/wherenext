export type Category = {
	name: string;
	key: string;
	min: number;
	max: number;
	features: { name: string; suffix?: string; prefix?: string }[];
};

export const categories: Category[] = [
	{
		name: 'Income',
		key: 'Median Annual Personal Income',
		min: 1,
		max: 2951,
		features: [
			{
				name: 'Median Annual Personal Income',
				prefix: '$'
			}
		]
	},
	{
		name: 'Rent affordability',
		min: 1,
		max: 587,
		key: 'Median Monthly Rent (1-bedroom Flat)',
		features: [
			{
				name: 'Median Monthly Rent (Studio)',
				prefix: '$'
			},
			{
				name: 'Median Monthly Rent (1-bedroom Flat)',
				prefix: '$'
			},
			{
				name: 'Median Monthly Rent (2-bedroom Flat)',
				prefix: '$'
			},
			{
				name: 'Median Monthly Rent (3-bedroom Flat)',
				prefix: '$'
			},
			{
				name: 'Median Monthly Rent (4-bedroom Flat)',
				prefix: '$'
			}
		]
	},
	{
		name: 'Employment',
		key: 'Total Labour Force',
		min: 1,
		max: 3006,
		features: [
			{
				name: 'Total Labour Force'
			},
			{ name: 'Employed' },
			{ name: 'Unemployed' },
			{
				name: 'Unemployment Rate',
				suffix: '%'
			}
		]
	},
	{
		name: 'Education',
		min: 1,
		max: 1907,
		key: "Adults with Bachelor's Degree or higher",
		features: [
			{ name: 'Adults with less than High School Diploma', suffix: '%' },
			{
				name: 'Adults with High School Diploma',
				suffix: '%'
			},
			{
				name: 'Adults completing a College Degree',
				suffix: '%'
			},
			{
				name: "Adults with Bachelor's Degree or higher",
				suffix: '%'
			}
		]
	},
	{
		name: 'Environment',
		min: 1,
		max: 3143,
		key: 'Overall Environmental Quality Score',
		features: [
			{
				name: 'Overall Environmental Quality Score',
				suffix: '/10'
			},
			{
				name: 'Sociodemographic Domain Score',
				suffix: '/10'
			},
			{
				name: 'Air Domain Score',
				suffix: '/10'
			},
			{
				name: 'Water Domain Score',
				suffix: '/10'
			},
			{
				name: 'Built-Environment Domain Score',
				suffix: '/10'
			},
			{
				name: 'Land Domain Score',
				suffix: '/10'
			}
		]
	}
];
