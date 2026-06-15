const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const artisans = [
  {
    name: 'Ananya Sen',
    email: 'ananya@begalweaves.com',
    password: 'password123',
    role: 'vendor',
    isVendorVerified: true,
    vendorDetails: {
      storeName: 'Bengal Weaves',
      description: 'Handloom sarees and textiles using organic dyes, keeping the traditional Jamdani weaving alive.',
      address: 'Kolkata, West Bengal',
      craftType: 'Textiles',
      logoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    }
  },
  {
    name: 'Ramesh Kumar',
    email: 'ramesh@clayandfire.com',
    password: 'password123',
    role: 'vendor',
    isVendorVerified: true,
    vendorDetails: {
      storeName: 'Clay & Fire',
      description: 'Studio pottery and traditional terracotta crafted with fine river clay and high-temperature kilns.',
      address: 'Jaipur, Rajasthan',
      craftType: 'Pottery',
      logoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    }
  },
  {
    name: 'Vikram Dev',
    email: 'vikram@royalcarvings.com',
    password: 'password123',
    role: 'vendor',
    isVendorVerified: true,
    vendorDetails: {
      storeName: 'Royal Carvings',
      description: 'Exquisite hand-carved rosewood furniture and home decor inspired by heritage motifs.',
      address: 'Mysuru, Karnataka',
      craftType: 'Woodwork',
      logoUrl: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=200',
    }
  },
  {
    name: 'Meera Bai',
    email: 'meera@dhokraart.com',
    password: 'password123',
    role: 'vendor',
    isVendorVerified: true,
    vendorDetails: {
      storeName: 'Dhokra Art',
      description: 'Traditional lost-wax brass castings portraying tribal life and mythical creatures.',
      address: 'Bastar, Chhattisgarh',
      craftType: 'Metalwork',
      logoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    }
  },
  {
    name: 'Sunita Sharma',
    email: 'sunita@jaipurjewels.com',
    password: 'password123',
    role: 'vendor',
    isVendorVerified: true,
    vendorDetails: {
      storeName: 'Jaipur Jewels',
      description: 'Traditional silver ornaments and Kundan work passed down through generations.',
      address: 'Jaipur, Rajasthan',
      craftType: 'Jewelry',
      logoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    }
  },
  {
    name: 'Rahul Verma',
    email: 'rahul@tempvendor.com',
    password: 'password123',
    role: 'vendor',
    isVendorVerified: false, // Unverified - should not show up on customer side
    vendorDetails: {
      storeName: 'Verma Crafts',
      description: 'Modern art and design experiments waiting for certification.',
      address: 'Delhi',
      craftType: 'Other',
      logoUrl: '',
    }
  },
  {
    name: 'Admin User',
    email: 'admin@kalabazaar.com',
    password: 'adminpassword',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@gmail.com',
    password: 'password123',
    role: 'customer',
  }
];

const productsData = [
  {
    vendorEmail: 'ananya@begalweaves.com',
    name: 'Royal Jamdani Silk Saree',
    description: 'A masterpiece of traditional weaving, this saree takes over 4 weeks of dedicated work on a manual handloom. Woven with fine mulberry silk and gold zari threads.',
    price: 6500,
    category: 'Textiles',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600'],
    stock: 5,
    storySnippet: 'Handcrafted on wooden looms in rural Bengal, keeping the 500-year-old Jamdani heritage alive.',
    artisanStory: 'Ananya Sen works with a collective of 12 women weavers in Phulia, West Bengal. By paying direct wages, she ensures that these master weavers earn a respectable living, preventing them from shifting to low-wage manual labor.',
    rating: 4.8,
    numReviews: 12
  },
  {
    vendorEmail: 'ramesh@clayandfire.com',
    name: 'Classic Blue Pottery Vase',
    description: 'Traditional Jaipur blue pottery made with Egyptian paste, glazed and hand-painted with cobalt blue floral patterns. Non-clay pottery that is glazed at low temperature.',
    price: 1200,
    category: 'Pottery',
    images: ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=600'],
    stock: 8,
    storySnippet: 'Fired at precise temperatures, this unique glaze work reflects the royal heritage of Jaipur.',
    artisanStory: 'Ramesh learned blue pottery from his father, who was recognized by the royal house of Jaipur. Today, Ramesh trains local youth to ensure this fragile and beautiful craft continues to thrive in the modern age.',
    rating: 4.6,
    numReviews: 8
  },
  {
    vendorEmail: 'vikram@royalcarvings.com',
    name: 'Carved Rosewood Jewelry Box',
    description: 'Hand-carved premium rosewood box with brass inlay work and velvet lining. Perfect for storing jewelry, keepsakes, and family heirlooms.',
    price: 2400,
    category: 'Woodwork',
    images: ['https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=600'],
    stock: 3,
    storySnippet: 'Intricate brass wires inlaid into seasoned rosewood by heritage woodcarving artisans.',
    artisanStory: 'Vikram Dev represents the fifth generation of woodcarvers in Mysuru. His workshop specializes in the intricate brass inlay method, known as "Pietra Dura", adapted to wood.',
    rating: 4.9,
    numReviews: 15
  },
  {
    vendorEmail: 'meera@dhokraart.com',
    name: 'Brass Dhokra Tribal Dancing Idol',
    description: 'Dhokra non-ferrous metal casting using the lost-wax casting technique. This idol represents the tribal dance celebrating the autumn harvest.',
    price: 3500,
    category: 'Metalwork',
    images: ['https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&q=80&w=600'],
    stock: 2,
    storySnippet: 'Created using the ancient lost-wax brass casting technique dating back to the Indus Valley Civilization.',
    artisanStory: 'Meera Bai lives in a remote tribal hamlet in Bastar. Through KalaBazaar, she has been able to export her bronze and brass figurines, making her family self-sufficient and securing school education for her children.',
    rating: 4.7,
    numReviews: 6
  },
  {
    vendorEmail: 'sunita@jaipurjewels.com',
    name: 'Silver Filigree Peacock Earrings',
    description: 'Intricate silver wirework handmade by master artisans. These earrings showcase a traditional peacock motif symbolizing grace and beauty.',
    price: 1800,
    category: 'Jewelry',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600'],
    stock: 10,
    storySnippet: 'Exquisite silver filigree crafted thread-by-thread by Rajasthan silversmiths.',
    artisanStory: 'Sunita Sharma started Jaipur Jewels to revive filigree and meenakari work. She works exclusively with women silversmiths, helping them achieve financial independence in rural Rajasthan.',
    rating: 5.0,
    numReviews: 20
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    console.log('Cleared existing data.');

    // Insert Users
    const createdUsers = await User.create(artisans);
    console.log(`Created ${createdUsers.length} users.`);

    // Map vendor emails to IDs
    const vendorMap = {};
    createdUsers.forEach(u => {
      if (u.role === 'vendor') {
        vendorMap[u.email] = u._id;
      }
    });

    // Assign vendors to products
    const productsToCreate = productsData.map(p => {
      const { vendorEmail, ...rest } = p;
      const vendorId = vendorMap[vendorEmail];
      if (!vendorId) {
        throw new Error(`Vendor not found for email: ${vendorEmail}`);
      }
      return {
        ...rest,
        vendor: vendorId
      };
    });

    // Insert Products
    const createdProducts = await Product.create(productsToCreate);
    console.log(`Created ${createdProducts.length} products.`);

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from DB.');
  }
};

seedDB();
