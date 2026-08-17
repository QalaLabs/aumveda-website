import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 128)
}

const PRODUCTS = [
  { name: "Dhan Lakshmi Bracelet", category: "Bracelets", price: 799, mrp: 1400, tag: "Bestseller", desc: "The Dhan Lakshmi Bracelet attracts wealth, stability, and protection into your everyday life.", img: "https://astrotalk.store/cdn/shop/files/image_22_dc7f8b9d-79fb-43e5-8a85-2a66576ca8a4.png?v=1768310652" },
  { name: "Vastu Pyrite Tortoise (Kachhua)", category: "Vastu", price: 699, mrp: 1700, tag: "Bestseller", desc: "In Vastu Shastra, the tortoise is a symbol of Lord Kurma, representing strength and long-lasting stability.", img: "https://astrotalk.store/cdn/shop/files/1_15_a56f33fe-a506-4f96-b300-5532597ba579.jpg?v=1770268007" },
  { name: "Money Magnet Bracelet", category: "Bracelets", price: 699, mrp: 1999, tag: "Sale", desc: "The Money Magnet Bracelet made up of 100% natural and original crystals believed to attract wealth and prosperity.", img: "https://astrotalk.store/cdn/shop/files/price_drop.webp?v=1745301541" },
  { name: "Raw Pyrite Bracelet with FREE Raw Selenite Plate", category: "Bracelets", price: 799, mrp: 3099, tag: "Sale", desc: "Attract wealth, success, and positive energy with the Raw Pyrite Bracelet, now paired with a FREE Raw Selenite Charging Plate.", img: "https://astrotalk.store/cdn/shop/files/1_670fca98-e011-4412-8c9c-f56fa5d8e960.webp?v=1769072419" },
  { name: "Dhan Yog Bracelet (Lab Certified)", category: "Bracelets", price: 699, mrp: 1999, tag: "Sale", desc: "Attract wealth and keep your energy balanced with the Dhan Yog Bracelet.", img: "https://astrotalk.store/cdn/shop/files/new_dhanyog_copy.webp?v=1771411837" },
  { name: "Money Maker Bracelet", category: "Bracelets", price: 699, mrp: 1999, tag: "Sale", desc: "Attract money, boost confidence, and protect yourself from negativity.", img: "https://astrotalk.store/cdn/shop/files/with_tag.webp?v=1749116073" },
  { name: "Raw Pyrite Stone", category: "Crystals", price: 599, mrp: 1999, tag: "Sale", desc: "Meet Original Raw Pyrite, often called Fool's Gold because of its natural golden shine.", img: "https://astrotalk.store/cdn/shop/files/1_9b96c584-8ca6-4819-8383-3c1a88114477.jpg?v=1769495980" },
  { name: "Super Raw Pyrite Bracelet", category: "Bracelets", price: 599, mrp: 1999, tag: "Sale", desc: "The Super Raw Pyrite Bracelet is designed to attract money, success, and abundance at faster speeds.", img: "https://astrotalk.store/cdn/shop/files/New_with_smooky_copy_1.webp?v=1743087196" },
  { name: "Navgraha Shanti Bracelet", category: "Bracelets", price: 599, mrp: 1999, tag: "Sale", desc: "Attract money and balance all Navagrahas.", img: "https://astrotalk.store/cdn/shop/files/Gemini_Generated_Image_9tho9f9tho9f9tho.webp?v=1769764805" },
  { name: "Karz Mukti Bracelet", category: "Bracelets", price: 699, mrp: 1999, tag: "Sale", desc: "The Karz Mukti Bracelet is designed to help you clear loans, EMIs, and attract money with ease.", img: "https://astrotalk.store/cdn/shop/files/2nd_image.jpg?v=1741782935" },
  { name: "Love & Money Attractor Bracelet", category: "Bracelets", price: 499, mrp: 1999, tag: "Sale", desc: "Crafted from 100% natural and original gemstones to attract both wealth and love into your life.", img: "https://astrotalk.store/cdn/shop/files/fqhjs8nhyfsnhwbltljt.webp?v=1742562603" },
  { name: "Raj Yog Combo", category: "Combos", price: 1199, mrp: 7996, tag: "Sale", desc: "A powerful collection of sacred and spiritual items designed to bring balance, prosperity, and protection.", img: "https://astrotalk.store/cdn/shop/files/ity48bidmbvrtxtey3lb.webp?v=1742551027" },
  { name: "Richie Rich Combo", category: "Combos", price: 999, mrp: 2999, tag: "Sale", desc: "Attract wealth and abundance with the Richie Rich Combo bracelets.", img: "https://astrotalk.store/cdn/shop/files/rrcc5.png?v=1735674639" },
  { name: "Money & Love Combo", category: "Combos", price: 949, mrp: 2999, tag: "Sale", desc: "Pairs Rose Quartz for love and healing with Money Magnet bracelet for attracting money and success.", img: "https://astrotalk.store/cdn/shop/files/1_bf2779f4-e5e2-41b2-810b-628123437a5e.jpg?v=1736429424" },
  { name: "Pyrite Money Magnet Pyramid", category: "Vastu", price: 999, mrp: 1700, desc: "Pyrite is a powerful money magnet that draws wealth, success, and abundance.", img: "https://astrotalk.store/cdn/shop/files/Money_Magnet_1b_6.webp?v=1756831989" },
  { name: "Pyrite Tumble", category: "Crystals", price: 449, mrp: 1000, desc: "Pyrite is a magnet for good fortune, financial growth, and business opportunities.", img: "https://astrotalk.store/cdn/shop/files/Pyrite_1.webp?v=1762231042" },
  { name: "Wealth OM Pyrite Bracelet", category: "Bracelets", price: 699, mrp: 1999, tag: "Sale", desc: "Bring both money and peace into your life with the Wealth OM Bracelet.", img: "https://astrotalk.store/cdn/shop/files/1_3_13.webp?v=1765268040" },
  { name: "Money Magnet Combo", category: "Combos", price: 1099, mrp: 4999, tag: "Sale", desc: "Includes a Pyrite Money Magnet Pyramid and a Money Magnet Turtle.", img: "https://astrotalk.store/cdn/shop/files/DSC_0932.jpg?v=1741242230" },
  { name: "Gold Plated Rudraksha Bracelet", category: "Bracelets", price: 599, mrp: 1999, tag: "Sale", desc: "Made with Nepali origin 5 mukhi Rudraksha beads for protection, knowledge and positive growth.", img: "https://astrotalk.store/cdn/shop/files/1.1_1_5bfd9f87-a7f7-4755-b912-c2f0de5f66ee.webp?v=1764333125" },
  { name: "Sampoorna Ganesha Pyrite Combo", category: "Combos", price: 1599, mrp: 3200, tag: "Bundle", desc: "Remove all obstacles, attract success, and invite wisdom into your life.", img: "https://astrotalk.store/cdn/shop/files/Untitled-1_1.webp?v=1757400382" },
  { name: "Pyrite Ganesh Ji Idol with FREE Raw Selenite Plate", category: "Vastu", price: 1111, mrp: 3099, desc: "Invite blessings, prosperity, and protection into your home or office.", img: "https://astrotalk.store/cdn/shop/files/WhatsApp_Image_2025-08-20_at_16.57.18.jpg?v=1755697091" },
]

async function main() {
  console.log('Seeding products...')

  let created = 0
  let skipped = 0

  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i]
    const slug = slugify(p.name)
    const sku = `AUM-${String(i + 1).padStart(4, '0')}`

    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing) {
      skipped++
      continue
    }

    await prisma.product.create({
      data: {
        sku,
        slug,
        title: p.name,
        description: p.desc,
        category: p.category,
        priceCents: p.price * 100,
        compareAtPriceCents: p.mrp ? p.mrp * 100 : null,
        images: [p.img],
        inventoryCount: 100,
        isActive: true,
        productType: 'physical',
        tags: p.tag ? [p.tag] : [],
      },
    })
    created++
  }

  console.log(`Products seeded: ${created} created, ${skipped} skipped (already exist).`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
