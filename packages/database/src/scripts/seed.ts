import { createId } from "@paralleldrive/cuid2";
import { db } from "../database";
import { users, customers } from "../schema/users";
import { categories, products } from "../schema/products";
import { hash } from "bcryptjs";

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    console.log("👤 Creating users...");
    const adminId = createId();
    const adminPasswordHash = await hash("admin123", 10);
    
    await db.insert(users).values({
      id: adminId,
      email: "admin@bytemart.com",
      password_hash: adminPasswordHash,
      first_name: "Admin",
      last_name: "User",
      phone: "+1234567890",
      role: "admin"
    });
    console.log("✅ Admin user created");

    const customerId = createId();
    const customerPasswordHash = await hash("customer123", 10);
    
    await db.insert(users).values({
      id: customerId,
      email: "customer@bytemart.com",
      password_hash: customerPasswordHash,
      first_name: "Test",
      last_name: "Customer",
      phone: "+1987654321",
      role: "customer"
    });
    console.log("✅ Test customer user created");

    await db.insert(customers).values({
      id: createId(),
      user_id: customerId
    });
    console.log("✅ Customer record created");

    console.log("📁 Creating categories...");
    const electronicsId = createId();
    const smartphonesId = createId();
    const laptopsId = createId();
    const accessoriesId = createId();

    await db.insert(categories).values([
      {
        id: electronicsId,
        name: "Electronics",
      },
      {
        id: smartphonesId,
        name: "Smartphones",
        parent_id: electronicsId,
      },
      {
        id: laptopsId,
        name: "Laptops",
        parent_id: electronicsId,
      },
      {
        id: accessoriesId,
        name: "Accessories",
        parent_id: electronicsId,
      },
    ]);
    console.log("✅ Categories created");

    console.log("📦 Creating products...");
    await db.insert(products).values([
      {
        id: createId(),
        name: "iPhone 15 Pro",
        description: "The latest iPhone with A17 Pro chip, titanium design, and advanced camera system.",
        price: "999.99",
        stock_quantity: 50,
        category_id: smartphonesId,
        image_url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845702708",
      },
      {
        id: createId(),
        name: "Samsung Galaxy S24 Ultra",
        description: "Samsung's flagship with S Pen, advanced AI features, and powerful camera system.",
        price: "1199.99",
        stock_quantity: 40,
        category_id: smartphonesId,
        image_url: "https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-ultra-s928-sm-s928bzgains-thumb-537055803",
      },
      {
        id: createId(),
        name: "MacBook Pro 16",
        description: "Powerful laptop with M3 Pro chip, stunning display, and all-day battery life.",
        price: "2499.99",
        stock_quantity: 30,
        category_id: laptopsId,
        image_url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1671304673202",
      },
      {
        id: createId(),
        name: "Dell XPS 15",
        description: "Premium Windows laptop with InfinityEdge display and powerful performance.",
        price: "1999.99",
        stock_quantity: 25,
        category_id: laptopsId,
        image_url: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9520/media-gallery/black/laptop-xps-15-9520-t-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402&chrss=full",
      },
      {
        id: createId(),
        name: "AirPods Pro 2",
        description: "Wireless earbuds with active noise cancellation and spatial audio.",
        price: "249.99",
        stock_quantity: 100,
        category_id: accessoriesId,
        image_url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361",
      },
      {
        id: createId(),
        name: "Samsung Galaxy Watch 6",
        description: "Advanced smartwatch with health monitoring and fitness tracking.",
        price: "299.99",
        stock_quantity: 75,
        category_id: accessoriesId,
        image_url: "https://images.samsung.com/is/image/samsung/p6pim/in/2307/gallery/in-galaxy-watch6-classic-r945-sm-r945fzsains-thumb-537055803",
      },
    ]);
    console.log("✅ Products created");

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }

  process.exit(0);
}

main();
