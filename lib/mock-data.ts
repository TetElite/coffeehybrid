/**
 * Mock data for testing when MongoDB is not available
 * This allows testing the frontend functionality without database dependency
 */

export const mockProducts = [
  {
    _id: '1',
    name: 'Espresso',
    description: 'Rich, concentrated coffee shot',
    basePrice: 3.50,
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b5c7faaf?w=400&h=400&fit=crop&q=80',
    category: { _id: 'cat1', name: 'Hot Coffee' },
    isAvailable: true,
    customizationOptions: {
      sizes: [
        { label: 'Single', priceModifier: 0 },
        { label: 'Double', priceModifier: 1.5 }
      ],
      sugarLevels: [
        'No Sugar',
        'Light',
        'Regular',
        'Extra'
      ],
      iceOptions: [
        'Hot'
      ],
      addOns: [
        { label: 'Extra Shot', price: 1.0 },
        { label: 'Vanilla Syrup', price: 0.75 }
      ]
    }
  },
  {
    _id: '2',
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and foam',
    basePrice: 4.25,
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop',
    category: { _id: 'cat1', name: 'Hot Coffee' },
    isAvailable: true,
    customizationOptions: {
      sizes: [
        { label: 'Small', priceModifier: 0 },
        { label: 'Medium', priceModifier: 0.75 },
        { label: 'Large', priceModifier: 1.5 }
      ],
      sugarLevels: [
        'No Sugar',
        'Light',
        'Regular',
        'Extra'
      ],
      iceOptions: [
        'Hot'
      ],
      addOns: [
        { label: 'Extra Shot', price: 1.0 },
        { label: 'Cinnamon', price: 0.5 },
        { label: 'Chocolate Powder', price: 0.75 }
      ]
    }
  },
  {
    _id: '3',
    name: 'Iced Latte',
    description: 'Chilled espresso with cold milk over ice',
    basePrice: 4.75,
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop',
    category: { _id: 'cat2', name: 'Cold Coffee' },
    isAvailable: true,
    customizationOptions: {
      sizes: [
        { label: 'Small', priceModifier: 0 },
        { label: 'Medium', priceModifier: 0.75 },
        { label: 'Large', priceModifier: 1.5 }
      ],
      sugarLevels: [
        'No Sugar',
        'Light',
        'Regular',
        'Extra'
      ],
      iceOptions: [
        'Regular Ice',
        'Extra Ice',
        'Light Ice'
      ],
      addOns: [
        { label: 'Oat Milk', price: 0.65 },
        { label: 'Vanilla Syrup', price: 0.75 },
        { label: 'Caramel Syrup', price: 0.75 }
      ]
    }
  },
  {
    _id: '4',
    name: 'Americano',
    description: 'Espresso diluted with hot water',
    basePrice: 3.75,
    imageUrl: 'https://images.unsplash.com/photo-1559478371-6a4bf4d2ac02?w=400&h=400&fit=crop',
    category: { _id: 'cat1', name: 'Hot Coffee' },
    isAvailable: true,
    customizationOptions: {
      sizes: [
        { label: 'Small', priceModifier: 0 },
        { label: 'Medium', priceModifier: 0.5 },
        { label: 'Large', priceModifier: 1.0 }
      ],
      sugarLevels: [
        'No Sugar',
        'Light',
        'Regular',
        'Extra'
      ],
      iceOptions: [
        'Hot'
      ],
      addOns: [
        { label: 'Extra Shot', price: 1.0 },
        { label: 'Milk', price: 0.5 }
      ]
    }
  },
  {
    _id: '5',
    name: 'Caramel Macchiato',
    description: 'Freshly steamed milk with vanilla-flavored syrup marked with espresso and topped with a caramel drizzle',
    basePrice: 5.25,
    imageUrl: 'https://images.unsplash.com/photo-1485808191679-5f8c7c8606af?w=400&h=400&fit=crop&q=80',
    category: { _id: 'cat1', name: 'Hot Coffee' },
    isAvailable: true,
    customizationOptions: {
      sizes: [
        { label: 'Tall', priceModifier: 0 },
        { label: 'Grande', priceModifier: 0.75 },
        { label: 'Venti', priceModifier: 1.25 }
      ],
      sugarLevels: ['Standard', 'Less Sweet', 'Extra Sweet'],
      iceOptions: ['Hot', 'Iced'],
      addOns: [{ label: 'Extra Caramel', price: 0.5 }]
    }
  },
  {
    _id: '6',
    name: 'Nitro Cold Brew',
    description: 'Our small-batch cold brew slow-steeped for a super smooth taste, infused with nitrogen for a sweet flavor and cascading crema',
    basePrice: 5.45,
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&h=400&fit=crop&q=80',
    category: { _id: 'cat2', name: 'Cold Coffee' },
    isAvailable: true,
    customizationOptions: {
      sizes: [
        { label: 'Tall', priceModifier: 0 },
        { label: 'Grande', priceModifier: 0.75 }
      ],
      addOns: [{ label: 'Sweet Cream', price: 0.75 }]
    }
  },
  {
    _id: '7',
    name: 'Strawberry Açaí Refresher',
    description: 'Sweet strawberry flavors accented by passion fruit and açaí notes, caffeinated with green coffee extract',
    basePrice: 4.95,
    imageUrl: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400&h=400&fit=crop&q=80',
    category: { _id: 'cat2', name: 'Cold Coffee' },
    isAvailable: true,
    customizationOptions: {
      sizes: [
        { label: 'Tall', priceModifier: 0 },
        { label: 'Grande', priceModifier: 0.5 },
        { label: 'Venti', priceModifier: 1.0 }
      ],
      iceOptions: ['Regular Ice', 'Light Ice', 'No Ice']
    }
  },
  {
    _id: '8',
    name: 'Matcha Green Tea Latte',
    description: 'Smooth and creamy matcha sweetened just right and served with steamed milk',
    basePrice: 4.95,
    imageUrl: 'https://images.unsplash.com/photo-1515823664409-787933b123e6?w=400&h=400&fit=crop&q=80',
    category: { _id: 'cat1', name: 'Hot Coffee' },
    isAvailable: true,
    customizationOptions: {
        sizes: [
            { label: 'Tall', priceModifier: 0 },
            { label: 'Grande', priceModifier: 0.75 },
            { label: 'Venti', priceModifier: 1.25 }
        ],
        addOns: [{ label: 'Soy Milk', price: 0.60 }, { label: 'Oat Milk', price: 0.60 }]
    }
}
];

export const mockCategories = [
  { _id: 'cat1', name: 'Hot Coffee', description: 'Steaming hot coffee beverages', slug: 'hot-coffee', sortOrder: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: 'cat2', name: 'Cold Coffee', description: 'Refreshing iced coffee drinks', slug: 'cold-coffee', sortOrder: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { _id: 'cat3', name: 'Pastries', description: 'Freshly baked goods', slug: 'pastries', sortOrder: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() }
];