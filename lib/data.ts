export type ProductVariant = {
	id: string;
	name: string;
	price: number;
	stock: number;
};

export type VariantOption = {
	name: string;
	options: string[];
};

export type Product = {
	id: string;
	name: string;
	description: string;
	images: string[];
	category: string;
	vendor: {
		id: string;
		name: string;
		logo?: string;
	};
	rating: number;
	reviewCount: number;
	faults?: string[];
	variants?: VariantOption[];
	variantProducts: ProductVariant[];
	defaultVariantId: string;
};

export type Service = {
	id: string;
	name: string;
	description: string;
	price:
		| number
		| {
				startingAt: number;
				unit: string;
		  };
	image: string;
	category: string;
	provider: {
		id: string;
		name: string;
		avatar?: string;
	};
	rating: number;
	reviewCount: number;
	duration?: string;
};

export const categories = [
	"All",
	"Food & Drinks",
	"Stationery",
	"Electronics",
	"Books",
	"Clothing",
	"Health & Beauty",
	"Home & Living",
	"Sports & Fitness",
];

export const serviceCategories = [
	"All",
	"Beauty & Grooming",
	"Repair & Maintenance",
	"Academic",
	"Cleaning",
	"Health & Wellness",
	"Tech Support",
	"Event Services",
	"Moving & Storage",
];

export const mockProducts: Product[] = [
	{
		id: "p1",
		name: "Campus Special Coffee",
		description:
			"Premium coffee blend, perfect for those late-night study sessions. Made from carefully selected Arabica beans, roasted to perfection to bring out rich flavors and aromatic notes. Each batch is freshly ground before packaging to ensure maximum freshness.",
		images: [
			"https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600",
			"https://images.pexels.com/photos/2074122/pexels-photo-2074122.jpeg?auto=compress&cs=tinysrgb&w=600",
			"https://images.pexels.com/photos/585753/pexels-photo-585753.jpeg?auto=compress&cs=tinysrgb&w=600",
			"https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=600",
		],
		category: "Food & Drinks",
		vendor: {
			id: "v1",
			name: "Campus Cafe",
		},
		rating: 4.8,
		reviewCount: 127,
		faults: ["May arrive 1-2 days after roasting date"],
		variants: [
			{
				name: "Size",
				options: ["Small", "Medium", "Large", "Extra Large"],
			},
			{
				name: "Temperature",
				options: ["Hot", "Iced"],
			},
		],
		variantProducts: [
			{ id: "p1-v1", name: "Small Hot", price: 3.99, stock: 50 },
			{ id: "p1-v2", name: "Small Iced", price: 4.29, stock: 45 },
			{ id: "p1-v3", name: "Medium Hot", price: 4.49, stock: 40 },
			{ id: "p1-v4", name: "Medium Iced", price: 4.79, stock: 35 },
			{ id: "p1-v5", name: "Large Hot", price: 4.99, stock: 30 },
			{ id: "p1-v6", name: "Large Iced", price: 5.29, stock: 25 },
			{ id: "p1-v7", name: "Extra Large Hot", price: 5.49, stock: 20 },
			{ id: "p1-v8", name: "Extra Large Iced", price: 5.79, stock: 15 },
		],
		defaultVariantId: "p1-v1",
	},
	{
		id: "p5",
		name: "Campus Hoodie",
		description: "Comfortable hoodie with embroidered campus logo.",
		images: [
			"https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg?auto=compress&cs=tinysrgb&w=600",
			"https://images.pexels.com/photos/6311388/pexels-photo-6311388.jpeg?auto=compress&cs=tinysrgb&w=600",
		],
		category: "Clothing",
		vendor: {
			id: "v5",
			name: "Campus Apparel",
		},
		rating: 4.9,
		reviewCount: 142,
		faults: ["Sizes may run slightly large"],
		variants: [
			{
				name: "Size",
				options: ["S", "M", "L", "XL", "2XL"],
			},
			{
				name: "Color",
				options: ["Black", "Gray", "Navy"],
			},
		],
		variantProducts: [
			{ id: "p5-v1", name: "S Black", price: 34.99, stock: 0 },
			{ id: "p5-v2", name: "S Gray", price: 34.99, stock: 12 },
			{ id: "p5-v3", name: "S Navy", price: 34.99, stock: 10 },
			{ id: "p5-v4", name: "M Black", price: 34.99, stock: 20 },
			{ id: "p5-v5", name: "M Gray", price: 34.99, stock: 18 },
			{ id: "p5-v6", name: "M Navy", price: 34.99, stock: 15 },
			{ id: "p5-v7", name: "L Black", price: 34.99, stock: 25 },
			{ id: "p5-v8", name: "L Gray", price: 34.99, stock: 22 },
			{ id: "p5-v9", name: "L Navy", price: 34.99, stock: 20 },
			{ id: "p5-v10", name: "XL Black", price: 36.99, stock: 15 },
			{ id: "p5-v11", name: "XL Gray", price: 36.99, stock: 12 },
			{ id: "p5-v12", name: "XL Navy", price: 36.99, stock: 10 },
			{ id: "p5-v13", name: "2XL Black", price: 36.99, stock: 10 },
			{ id: "p5-v14", name: "2XL Gray", price: 36.99, stock: 8 },
			{ id: "p5-v15", name: "2XL Navy", price: 36.99, stock: 5 },
		],
		defaultVariantId: "p5-v7",
	},
];

export const mockServices: Service[] = [
	{
		id: "s1",
		name: "Haircut & Styling",
		description: "Professional haircut and styling service on campus.",
		price: {
			startingAt: 20,
			unit: "session",
		},
		image:
			"https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=600",
		category: "Beauty & Grooming",
		provider: {
			id: "p1",
			name: "Campus Salon",
		},
		rating: 4.9,
		reviewCount: 215,
		duration: "30-45 min",
	},
	{
		id: "s2",
		name: "Laptop Repair",
		description: "Quick and reliable laptop repair service.",
		price: {
			startingAt: 35,
			unit: "diagnosis",
		},
		image:
			"https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=600",
		category: "Repair & Maintenance",
		provider: {
			id: "p2",
			name: "Tech Repair Center",
		},
		rating: 4.7,
		reviewCount: 128,
		duration: "1-3 days",
	},
	{
		id: "s3",
		name: "Tutoring - Mathematics",
		description: "One-on-one mathematics tutoring for all levels.",
		price: {
			startingAt: 25,
			unit: "hour",
		},
		image:
			"https://images.pexels.com/photos/5212361/pexels-photo-5212361.jpeg?auto=compress&cs=tinysrgb&w=600",
		category: "Academic",
		provider: {
			id: "p3",
			name: "Campus Tutors",
		},
		rating: 4.8,
		reviewCount: 94,
		duration: "1 hour",
	},
	{
		id: "s4",
		name: "Room Cleaning",
		description: "Thorough dormitory cleaning service.",
		price: {
			startingAt: 30,
			unit: "session",
		},
		image:
			"https://images.pexels.com/photos/4107108/pexels-photo-4107108.jpeg?auto=compress&cs=tinysrgb&w=600",
		category: "Cleaning",
		provider: {
			id: "p4",
			name: "Campus Cleaners",
		},
		rating: 4.6,
		reviewCount: 87,
		duration: "1-2 hours",
	},
	{
		id: "s5",
		name: "Fitness Training",
		description: "Personalized fitness training sessions.",
		price: {
			startingAt: 40,
			unit: "session",
		},
		image:
			"https://images.pexels.com/photos/4754015/pexels-photo-4754015.jpeg?auto=compress&cs=tinysrgb&w=600",
		category: "Health & Wellness",
		provider: {
			id: "p5",
			name: "Campus Fitness",
		},
		rating: 4.9,
		reviewCount: 156,
		duration: "45-60 min",
	},
	{
		id: "s6",
		name: "Phone Screen Replacement",
		description: "Quick phone screen replacement with quality parts.",
		price: {
			startingAt: 45,
			unit: "repair",
		},
		image:
			"https://images.pexels.com/photos/4545940/pexels-photo-4545940.jpeg?auto=compress&cs=tinysrgb&w=600",
		category: "Tech Support",
		provider: {
			id: "p2",
			name: "Tech Repair Center",
		},
		rating: 4.7,
		reviewCount: 73,
		duration: "1-2 hours",
	},
	{
		id: "s7",
		name: "Event Photography",
		description: "Professional photography for campus events.",
		price: {
			startingAt: 100,
			unit: "event",
		},
		image:
			"https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=600",
		category: "Event Services",
		provider: {
			id: "p6",
			name: "Campus Creatives",
		},
		rating: 4.8,
		reviewCount: 62,
		duration: "Varies",
	},
	{
		id: "s8",
		name: "Storage Service",
		description: "Secure storage for your belongings during breaks.",
		price: {
			startingAt: 50,
			unit: "month",
		},
		image:
			"https://images.pexels.com/photos/4482895/pexels-photo-4482895.jpeg?auto=compress&cs=tinysrgb&w=600",
		category: "Moving & Storage",
		provider: {
			id: "p7",
			name: "Campus Storage",
		},
		rating: 4.5,
		reviewCount: 48,
		duration: "As needed",
	},
];
