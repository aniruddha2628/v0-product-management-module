// ArtisanHub Category Taxonomy v1.0
// Complete category structure with sub-categories and dynamic attributes

export type FieldType = 'dropdown' | 'multi-select' | 'text' | 'number' | 'toggle' | 'dimensions';

export interface CategoryAttribute {
  name: string;
  fieldName: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  placeholder?: string;
  hint?: string;
  unit?: string;
  conditionalOn?: {
    field: string;
    values: string[];
  };
}

export interface SubCategory {
  id: string;
  name: string;
  hasGiTag?: boolean;
  giTagName?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  subCategories: SubCategory[];
  attributes: CategoryAttribute[];
}

// Shared attributes that appear on every product
export const sharedAttributes: CategoryAttribute[] = [
  {
    name: 'Product Title',
    fieldName: 'title',
    type: 'text',
    required: true,
    placeholder: 'e.g., Handmade Blue Pottery Vase - Traditional Jaipur Design',
    hint: 'Max 120 characters. Be descriptive and include key features.',
  },
  {
    name: 'Description',
    fieldName: 'description',
    type: 'text',
    required: true,
    placeholder: 'Describe your product in detail...',
    hint: 'Max 2000 characters. Include materials, techniques, story behind the craft.',
  },
  {
    name: 'Selling Price',
    fieldName: 'sellingPrice',
    type: 'number',
    required: true,
    placeholder: '0',
    unit: '₹',
    hint: 'The price customers will pay',
  },
  {
    name: 'MRP / Original Price',
    fieldName: 'mrp',
    type: 'number',
    required: false,
    placeholder: '0',
    unit: '₹',
    hint: 'Optional. Shows as crossed-out price for discount display.',
  },
  {
    name: 'Stock Quantity',
    fieldName: 'stockQuantity',
    type: 'number',
    required: true,
    placeholder: '1',
    hint: 'Number of items available for sale',
  },
  {
    name: 'SKU / Product Code',
    fieldName: 'sku',
    type: 'text',
    required: false,
    placeholder: 'e.g., BP-VASE-001',
    hint: 'Optional. Auto-generated if left blank.',
  },
  {
    name: 'State of Origin',
    fieldName: 'stateOfOrigin',
    type: 'dropdown',
    required: true,
    options: [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
      'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
      'Andaman & Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli',
      'Daman & Diu', 'Delhi', 'Jammu & Kashmir', 'Ladakh',
      'Lakshadweep', 'Puducherry'
    ],
    placeholder: 'Select state',
  },
  {
    name: 'GI Tag Certified',
    fieldName: 'giTagCertified',
    type: 'toggle',
    required: false,
    hint: 'Does this product have a Geographical Indication certification?',
  },
  {
    name: 'Dispatch Time',
    fieldName: 'dispatchTime',
    type: 'dropdown',
    required: true,
    options: [
      '1-2 business days',
      '3-5 business days',
      '1 week',
      '2 weeks',
      '3-4 weeks (made to order)'
    ],
    placeholder: 'Select dispatch time',
  },
  {
    name: 'Customisation Available',
    fieldName: 'customisationAvailable',
    type: 'toggle',
    required: false,
    hint: 'Can customers request customizations?',
  },
];

export const categories: Category[] = [
  {
    id: 'pottery-ceramics',
    name: 'Pottery & Ceramics',
    icon: '🏺',
    description: 'Terracotta, earthenware, stoneware, blue pottery, and clay products',
    subCategories: [
      { id: 'terracotta', name: 'Terracotta & Earthenware' },
      { id: 'blue-pottery', name: 'Blue Pottery', hasGiTag: true, giTagName: 'Jaipur Blue Pottery' },
      { id: 'stoneware', name: 'Stoneware & Glazed Ceramics' },
      { id: 'decorative-pots', name: 'Decorative Pots & Vases' },
      { id: 'tableware', name: 'Functional Tableware' },
      { id: 'planters', name: 'Planters & Garden Pottery' },
      { id: 'diyas-lamps', name: 'Diyas, Lamps & Ritual Items' },
      { id: 'clay-figurines', name: 'Clay Figurines & Sculptures' },
    ],
    attributes: [
      {
        name: 'Clay / Material Type',
        fieldName: 'clayType',
        type: 'dropdown',
        required: true,
        options: ['Terracotta', 'Red clay', 'Black clay', 'Kaolin / porcelain', 'Stoneware clay', 'Quartz-mix (blue pottery)'],
      },
      {
        name: 'Firing Technique',
        fieldName: 'firingTechnique',
        type: 'dropdown',
        required: true,
        options: ['Wood-fired', 'Kiln-fired', 'Sun-dried / unglazed', 'Gas-fired'],
      },
      {
        name: 'Glaze Type',
        fieldName: 'glazeType',
        type: 'dropdown',
        required: false,
        options: ['Unglazed', 'Partial glaze', 'Full glaze', 'Lead-free glaze', 'Natural ash glaze'],
      },
      {
        name: 'Finish / Surface Treatment',
        fieldName: 'finish',
        type: 'multi-select',
        required: false,
        options: ['Hand-painted', 'Embossed', 'Incised', 'Plain / natural'],
      },
      {
        name: 'Dimensions',
        fieldName: 'dimensions',
        type: 'dimensions',
        required: true,
        hint: 'Length × Width × Height in cm',
      },
      {
        name: 'Weight',
        fieldName: 'weight',
        type: 'number',
        required: true,
        unit: 'grams',
        hint: 'Needed for shipping cost calculation',
      },
      {
        name: 'Food Safe',
        fieldName: 'foodSafe',
        type: 'toggle',
        required: true,
        hint: 'Critical for tableware. Lead-free glaze required if Yes',
      },
      {
        name: 'Waterproof / Sealed',
        fieldName: 'waterproof',
        type: 'toggle',
        required: false,
        hint: 'For planters and outdoor use items',
      },
      {
        name: 'Care Instructions',
        fieldName: 'careInstructions',
        type: 'multi-select',
        required: false,
        options: ['Hand-wash only', 'Dishwasher safe', 'Microwave safe', 'Keep dry'],
      },
      {
        name: 'Craft Tradition / Regional Style',
        fieldName: 'craftTradition',
        type: 'dropdown',
        required: false,
        options: ['Khavda pottery', 'Longpi black pottery', 'Nirmal pottery', 'Blue pottery (Jaipur)', 'Molela terracotta', 'Bankura horse', 'Other'],
      },
    ],
  },
  {
    id: 'handloom-textiles',
    name: 'Handloom & Textiles',
    icon: '🪡',
    description: 'Sarees, fabrics, apparel, home textiles - handwoven and hand-printed',
    subCategories: [
      { id: 'sarees', name: 'Sarees', hasGiTag: true },
      { id: 'dress-material', name: 'Dress Material & Fabric' },
      { id: 'dupattas', name: 'Dupattas & Stoles' },
      { id: 'womens-apparel', name: "Women's Apparel (Readymade)" },
      { id: 'mens-apparel', name: "Men's Apparel (Kurta, Shirt)" },
      { id: 'shawls', name: 'Shawls & Wraps' },
      { id: 'bed-covers', name: 'Bed Covers & Quilts' },
      { id: 'cushion-covers', name: 'Cushion Covers & Table Linen' },
      { id: 'bath-linen', name: 'Towels & Bath Linen' },
      { id: 'wall-hangings', name: 'Wall Hangings & Tapestries' },
      { id: 'fabric-bags', name: 'Bags & Totes (fabric)' },
      { id: 'rugs', name: 'Rugs, Dhurries & Carpets', hasGiTag: true },
      { id: 'scarves', name: 'Scarves & Fashion Accessories' },
      { id: 'fabric-metre', name: 'Fabric by the Metre' },
    ],
    attributes: [
      {
        name: 'Fabric / Fibre Type',
        fieldName: 'fabricType',
        type: 'dropdown',
        required: true,
        options: ['Cotton', 'Silk', 'Wool', 'Linen', 'Jute', 'Bamboo silk', 'Chanderi', 'Muslin', 'Mixed/blended'],
      },
      {
        name: 'Weave / Craft Technique',
        fieldName: 'weaveTechnique',
        type: 'dropdown',
        required: true,
        options: [
          'Handloom (plain)', 'Ikat', 'Jamdani', 'Banarasi brocade', 'Kanjivaram',
          'Sambalpuri', 'Phulkari', 'Kantha', 'Block print', 'Batik',
          'Bandhani', 'Ajrakh', 'Kalamkari', 'Chikankari', 'Shibori',
          'Screen print', 'Leheriya', 'Zardozi'
        ],
      },
      {
        name: 'Product Type',
        fieldName: 'productType',
        type: 'dropdown',
        required: true,
        options: ['Saree', 'Unstitched fabric', 'Stitched garment', 'Dupatta', 'Stole', 'Scarf', 'Home textile', 'Rug / carpet'],
      },
      {
        name: 'Dimensions / Length',
        fieldName: 'textileDimensions',
        type: 'text',
        required: true,
        placeholder: 'e.g., 5.5m × 1.1m for sarees',
        hint: 'Specify length and width',
      },
      {
        name: 'Blouse Piece Included',
        fieldName: 'blousePiece',
        type: 'dropdown',
        required: false,
        options: ['Yes', 'No', 'Separate price'],
        conditionalOn: { field: 'productType', values: ['Saree'] },
      },
      {
        name: 'Dye Type',
        fieldName: 'dyeType',
        type: 'multi-select',
        required: false,
        options: ['Natural dye', 'Azo-free', 'Chemical dye', 'Vegetable dye'],
      },
      {
        name: 'Wash Care',
        fieldName: 'washCare',
        type: 'multi-select',
        required: true,
        options: ['Dry clean only', 'Hand wash', 'Machine wash cold', 'Warm iron', 'Do not bleach'],
      },
      {
        name: 'Occasion',
        fieldName: 'occasion',
        type: 'multi-select',
        required: false,
        options: ['Daily wear', 'Festive', 'Wedding', 'Office', 'Casual'],
      },
      {
        name: 'Transparency',
        fieldName: 'transparency',
        type: 'dropdown',
        required: false,
        options: ['Opaque', 'Semi-transparent', 'Sheer', 'Tissue'],
      },
      {
        name: 'Thread Count / GSM',
        fieldName: 'threadCount',
        type: 'number',
        required: false,
        hint: 'For bed linens and premium fabrics',
      },
      {
        name: 'Regional Craft Tradition',
        fieldName: 'craftTradition',
        type: 'dropdown',
        required: false,
        options: ['Banarasi', 'Kanjivaram', 'Pochampally', 'Chanderi', 'Paithani', 'Sambalpuri', 'Jamdani', 'Pashmina', 'Gadwal', 'Other'],
      },
    ],
  },
  {
    id: 'jewellery-accessories',
    name: 'Jewellery & Accessories',
    icon: '💎',
    description: 'Handmade metal, bead, fabric, and stone jewellery',
    subCategories: [
      { id: 'necklaces', name: 'Necklaces & Haars' },
      { id: 'earrings', name: 'Earrings & Jhumkas' },
      { id: 'bangles', name: 'Bangles, Kadas & Bracelets' },
      { id: 'rings', name: 'Rings & Toe Rings' },
      { id: 'head-jewellery', name: 'Maang Tikka & Head Jewellery' },
      { id: 'anklets', name: 'Anklets (Payal)' },
      { id: 'brooches', name: 'Brooches & Pins' },
      { id: 'hair-accessories', name: 'Hair Accessories' },
      { id: 'jewellery-sets', name: 'Jewellery Sets (multi-piece)' },
    ],
    attributes: [
      {
        name: 'Primary Material',
        fieldName: 'primaryMaterial',
        type: 'dropdown',
        required: true,
        options: [
          'Sterling silver', 'Gold-plated brass', 'Oxidised silver', 'German silver',
          'Copper', 'Brass', 'Dokra (lost-wax)', 'Terracotta', 'Fabric / thread', 'Resin', 'Beaded'
        ],
      },
      {
        name: 'Stone / Embellishment',
        fieldName: 'stoneEmbellishment',
        type: 'multi-select',
        required: false,
        options: ['Kundan', 'Meenakari enamel', 'Semi-precious stones', 'Glass beads', 'Pearl', 'Lac', 'Shell', 'No stone'],
      },
      {
        name: 'Craft Style',
        fieldName: 'craftStyle',
        type: 'dropdown',
        required: false,
        options: ['Kundan', 'Meenakari', 'Filigree (Odisha)', 'Dokra', 'Thewa', 'Lac jewellery', 'Bidri', 'Patan Patola-inspired', 'Plain handmade'],
      },
      {
        name: 'Colour / Finish',
        fieldName: 'colourFinish',
        type: 'dropdown',
        required: true,
        options: ['Gold tone', 'Silver tone', 'Oxidised / antique', 'Rose gold', 'Multi-colour', 'Natural'],
      },
      {
        name: 'Weight',
        fieldName: 'weight',
        type: 'number',
        required: true,
        unit: 'grams',
        hint: 'Essential for pricing transparency',
      },
      {
        name: 'Size / Adjustable',
        fieldName: 'sizeAdjustable',
        type: 'text',
        required: true,
        placeholder: 'e.g., 18 inches or "adjustable"',
        hint: 'Length in cm or "adjustable / free size"',
      },
      {
        name: 'Nickel-free / Hypoallergenic',
        fieldName: 'nickelFree',
        type: 'toggle',
        required: false,
        hint: 'Important for buyers with metal sensitivity',
      },
      {
        name: 'Occasion',
        fieldName: 'occasion',
        type: 'multi-select',
        required: false,
        options: ['Bridal', 'Festive', 'Daily wear', 'Office wear', 'Casual'],
      },
    ],
  },
  {
    id: 'wood-craft',
    name: 'Wood Craft & Carving',
    icon: '🪵',
    description: 'Carved, turned, lacquered, and inlaid woodwork',
    subCategories: [
      { id: 'carved-decor', name: 'Carved Décor & Figurines' },
      { id: 'lacquerware', name: 'Lacquerware (Turned wood)' },
      { id: 'wooden-toys', name: 'Wooden Toys', hasGiTag: true, giTagName: 'Channapatna Toys' },
      { id: 'kitchenware-wood', name: 'Kitchenware & Tableware' },
      { id: 'furniture', name: 'Furniture & Storage' },
      { id: 'inlay-work', name: 'Inlay & Marquetry Work' },
      { id: 'frames-mirrors', name: 'Frames, Mirrors & Wall Art' },
      { id: 'puppets-dolls', name: 'Puppets & Dolls' },
      { id: 'pooja-items-wood', name: 'Pooja & Ritual Items' },
    ],
    attributes: [
      {
        name: 'Wood Type',
        fieldName: 'woodType',
        type: 'dropdown',
        required: true,
        options: ['Mango wood', 'Sheesham (rosewood)', 'Teak', 'Walnut', 'Neem', 'Bamboo', 'Reclaimed / driftwood', 'Pine', 'Not specified'],
      },
      {
        name: 'Craft Technique',
        fieldName: 'craftTechnique',
        type: 'dropdown',
        required: true,
        options: ['Hand-carved', 'Lathe-turned', 'Lacquerware', 'Inlay work', 'Hand-painted', 'Burnt / pyrography', 'Jali (lattice) carving'],
      },
      {
        name: 'Finish / Treatment',
        fieldName: 'finish',
        type: 'multi-select',
        required: true,
        options: ['Natural / unfinished', 'Lacquer-coated', 'Painted', 'Varnished', 'Wax-polished', 'Distressed / antique'],
      },
      {
        name: 'Dimensions',
        fieldName: 'dimensions',
        type: 'dimensions',
        required: true,
        hint: 'Length × Width × Height in cm',
      },
      {
        name: 'Weight',
        fieldName: 'weight',
        type: 'number',
        required: true,
        unit: 'grams',
      },
      {
        name: 'Child Safe / Non-toxic Finish',
        fieldName: 'childSafe',
        type: 'toggle',
        required: false,
        hint: 'Required for toys and children\'s items',
      },
      {
        name: 'Outdoor Suitable',
        fieldName: 'outdoorSuitable',
        type: 'toggle',
        required: false,
        hint: 'For garden items and outdoor furniture',
      },
      {
        name: 'Regional Craft Tradition',
        fieldName: 'craftTradition',
        type: 'dropdown',
        required: false,
        options: ['Saharanpur carving', 'Kashmir walnut carving', 'Channapatna', 'Nirmal lacquerware', 'Rajasthan lacquerware', 'Kondapalli toys', 'Etikoppaka', 'Other'],
      },
    ],
  },
  {
    id: 'metal-craft',
    name: 'Metal Craft & Brassware',
    icon: '⚱️',
    description: 'Brass, copper, Dhokra, Bidri, and metal handicrafts',
    subCategories: [
      { id: 'metal-idols', name: 'Idols & Figurines' },
      { id: 'metal-decor', name: 'Home Décor & Showpieces' },
      { id: 'metal-kitchenware', name: 'Kitchenware & Utensils' },
      { id: 'metal-lamps', name: 'Lamps & Diyas (metal)' },
      { id: 'dhokra', name: 'Dhokra Craft', hasGiTag: true },
      { id: 'bidri', name: 'Bidri Work', hasGiTag: true },
      { id: 'metal-wall-art', name: 'Wall Art & Panels' },
      { id: 'metal-frames', name: 'Clocks & Frames (metal)' },
      { id: 'pooja-thali', name: 'Pooja Thali & Ritual Items' },
    ],
    attributes: [
      {
        name: 'Metal / Alloy Type',
        fieldName: 'metalType',
        type: 'dropdown',
        required: true,
        options: ['Brass', 'Copper', 'Bronze', 'Bell metal (Kansa)', 'Iron', 'Silver', 'Zinc alloy', 'Pewter', 'Mixed metals'],
      },
      {
        name: 'Craft Technique',
        fieldName: 'craftTechnique',
        type: 'dropdown',
        required: true,
        options: ['Lost-wax casting (Dhokra)', 'Hammering', 'Engraving', 'Repoussé', 'Inlay (Bidri)', 'Electroplating', 'Sand casting', 'Welding'],
      },
      {
        name: 'Finish',
        fieldName: 'finish',
        type: 'dropdown',
        required: true,
        options: ['Polished / shiny', 'Antique / oxidised', 'Lacquered', 'Matt', 'Gold-plated', 'Silver-plated'],
      },
      {
        name: 'Dimensions',
        fieldName: 'dimensions',
        type: 'dimensions',
        required: true,
        hint: 'Length × Width × Height in cm',
      },
      {
        name: 'Weight',
        fieldName: 'weight',
        type: 'number',
        required: true,
        unit: 'grams',
        hint: 'Critical for shipping — metal is heavy',
      },
      {
        name: 'Food Safe / Lead-free',
        fieldName: 'foodSafe',
        type: 'toggle',
        required: false,
        hint: 'Required for kitchenware and utensils',
      },
      {
        name: 'Care Instructions',
        fieldName: 'careInstructions',
        type: 'multi-select',
        required: false,
        options: ['Dry cloth only', 'No water', 'Avoid chemicals', 'Periodic polishing required'],
      },
    ],
  },
  {
    id: 'embroidery-needlework',
    name: 'Embroidery & Needlework',
    icon: '🧵',
    description: 'Chikankari, Zardozi, Phulkari, Kantha, Kashmiri work',
    subCategories: [
      { id: 'chikankari', name: 'Chikankari Work', hasGiTag: true },
      { id: 'zardozi', name: 'Zardozi & Zari Work' },
      { id: 'phulkari', name: 'Phulkari', hasGiTag: true },
      { id: 'kantha', name: 'Kantha Stitch' },
      { id: 'kashmiri', name: 'Kashmiri Aari / Crewel Work' },
      { id: 'kutchi', name: 'Kutchi & Banjara Embroidery' },
      { id: 'embroidered-home', name: 'Embroidered Home Textiles' },
    ],
    attributes: [
      {
        name: 'Embroidery Technique',
        fieldName: 'embroideryTechnique',
        type: 'dropdown',
        required: true,
        options: ['Chikankari', 'Zardozi', 'Phulkari', 'Kantha', 'Kashmiri Aari', 'Kasuti', 'Banjara', 'Cross-stitch', 'Crewel', 'Mirror work (shisha)', 'Other'],
      },
      {
        name: 'Base Fabric',
        fieldName: 'baseFabric',
        type: 'dropdown',
        required: true,
        options: ['Cotton', 'Georgette', 'Silk', 'Muslin', 'Linen', 'Velvet', 'Chiffon'],
      },
      {
        name: 'Thread Material',
        fieldName: 'threadMaterial',
        type: 'multi-select',
        required: false,
        options: ['Cotton thread', 'Silk thread', 'Zari (gold)', 'Zari (silver)', 'Woollen', 'Synthetic'],
      },
      {
        name: 'Coverage',
        fieldName: 'coverage',
        type: 'dropdown',
        required: false,
        options: ['All-over', 'Border only', 'Yoke only', 'Scattered motifs'],
      },
      {
        name: 'Product Type',
        fieldName: 'productType',
        type: 'dropdown',
        required: true,
        options: ['Saree', 'Kurta / dress material', 'Dupatta', 'Cushion cover', 'Table runner', 'Wall hanging', 'Bag'],
      },
      {
        name: 'Dimensions',
        fieldName: 'dimensions',
        type: 'text',
        required: true,
        placeholder: 'e.g., 2.5m unstitched kurta',
      },
      {
        name: 'Wash Care',
        fieldName: 'washCare',
        type: 'multi-select',
        required: true,
        options: ['Dry clean only', 'Hand wash cold', 'Reverse wash', 'Do not wring'],
      },
      {
        name: 'Approximate Stitch Hours',
        fieldName: 'stitchHours',
        type: 'dropdown',
        required: false,
        options: ['Under 10h', '10–50h', '50–100h', '100h+'],
        hint: 'Helps buyers appreciate labour value',
      },
    ],
  },
  {
    id: 'paintings-folk-art',
    name: 'Paintings & Folk Art',
    icon: '🎨',
    description: 'Madhubani, Warli, Pattachitra, Kalamkari, Gond, and miniatures',
    subCategories: [
      { id: 'madhubani', name: 'Madhubani / Mithila', hasGiTag: true },
      { id: 'warli', name: 'Warli Art' },
      { id: 'pattachitra', name: 'Pattachitra', hasGiTag: true },
      { id: 'gond', name: 'Gond Art' },
      { id: 'kalamkari', name: 'Kalamkari', hasGiTag: true },
      { id: 'pichwai', name: 'Pichwai' },
      { id: 'miniature', name: 'Rajasthani Miniature' },
      { id: 'phad', name: 'Phad Painting' },
      { id: 'mural', name: 'Kerala Mural Art' },
      { id: 'contemporary-folk', name: 'Contemporary / Other Folk Art' },
    ],
    attributes: [
      {
        name: 'Art Style / Tradition',
        fieldName: 'artStyle',
        type: 'dropdown',
        required: true,
        options: ['Madhubani', 'Warli', 'Gond', 'Pattachitra', 'Kalamkari', 'Pichwai', 'Miniature', 'Phad', 'Mural', 'Tikuli', 'Mandana', 'Other'],
      },
      {
        name: 'Surface / Base',
        fieldName: 'surface',
        type: 'dropdown',
        required: true,
        options: ['Handmade paper', 'Canvas', 'Fabric / silk', 'Palm leaf', 'Clay board', 'Wooden panel', 'Tussar silk', 'Cotton'],
      },
      {
        name: 'Medium / Colours Used',
        fieldName: 'medium',
        type: 'multi-select',
        required: true,
        options: ['Natural / vegetable pigments', 'Watercolour', 'Acrylic', 'Gouache', 'Ink', 'Natural dye on fabric'],
      },
      {
        name: 'Dimensions (H × W)',
        fieldName: 'artDimensions',
        type: 'text',
        required: true,
        placeholder: 'e.g., 60 × 45 cm',
        hint: 'Height before width — standard art convention',
      },
      {
        name: 'Framed / Unframed',
        fieldName: 'framed',
        type: 'dropdown',
        required: true,
        options: ['Unframed (rolled)', 'Framed', 'Stretched canvas', 'Mounted'],
      },
      {
        name: 'Signed by Artist',
        fieldName: 'signed',
        type: 'toggle',
        required: false,
        hint: 'Adds provenance value',
      },
      {
        name: 'Certificate of Authenticity',
        fieldName: 'certificate',
        type: 'toggle',
        required: false,
      },
      {
        name: 'Subject / Theme',
        fieldName: 'subject',
        type: 'multi-select',
        required: false,
        options: ['Mythology & deities', 'Nature & flora', 'Wildlife', 'Village life', 'Festival', 'Abstract', 'Contemporary'],
      },
    ],
  },
  {
    id: 'leather-goods',
    name: 'Leather Goods',
    icon: '👜',
    description: 'Handmade bags, footwear, wallets, and accessories',
    subCategories: [
      { id: 'footwear', name: 'Footwear', hasGiTag: true, giTagName: 'Kolhapuri Chappals' },
      { id: 'handbags', name: 'Handbags & Totes' },
      { id: 'clutches', name: 'Clutches & Potlis' },
      { id: 'wallets', name: 'Wallets & Card Holders' },
      { id: 'belts', name: 'Belts & Straps' },
      { id: 'leather-accessories', name: 'Decorative & Accessories' },
    ],
    attributes: [
      {
        name: 'Leather Type',
        fieldName: 'leatherType',
        type: 'dropdown',
        required: true,
        options: ['Full-grain leather', 'Tan leather', 'Camel leather', 'Vegan / faux leather', 'Jute-lined', 'Embossed leather'],
      },
      {
        name: 'Tanning Process',
        fieldName: 'tanningProcess',
        type: 'dropdown',
        required: false,
        options: ['Vegetable tanned', 'Chrome tanned', 'Oil-tanned', 'Not specified'],
      },
      {
        name: 'Embellishment',
        fieldName: 'embellishment',
        type: 'multi-select',
        required: false,
        options: ['Hand-painted', 'Embroidered', 'Mirror work', 'Metal studs', 'Zari border', 'Block print', 'Plain'],
      },
      {
        name: 'Closure Type',
        fieldName: 'closureType',
        type: 'dropdown',
        required: false,
        options: ['Zipper', 'Magnetic snap', 'Button', 'Tie-closure', 'Open top', 'Drawstring'],
      },
      {
        name: 'Dimensions',
        fieldName: 'dimensions',
        type: 'dimensions',
        required: true,
        hint: 'Length × Width × Height in cm',
      },
      {
        name: 'Footwear Size (India)',
        fieldName: 'footwearSize',
        type: 'dropdown',
        required: false,
        options: ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        conditionalOn: { field: 'subCategory', values: ['footwear'] },
      },
    ],
  },
  {
    id: 'bamboo-cane-grass',
    name: 'Bamboo, Cane & Grass Craft',
    icon: '🎋',
    description: 'Woven bamboo, cane, Sabai grass, and natural fibre products',
    subCategories: [
      { id: 'baskets', name: 'Baskets & Storage Boxes' },
      { id: 'trays', name: 'Trays & Platters' },
      { id: 'bamboo-decor', name: 'Home Décor & Showpieces' },
      { id: 'bamboo-furniture', name: 'Furniture & Shelving' },
      { id: 'bamboo-lamps', name: 'Lamps & Lampshades' },
      { id: 'grass-products', name: 'Sikki / Sabai Grass Products' },
      { id: 'eco-kitchenware', name: 'Eco Kitchenware' },
    ],
    attributes: [
      {
        name: 'Material',
        fieldName: 'material',
        type: 'multi-select',
        required: true,
        options: ['Bamboo', 'Cane / rattan', 'Sabai grass', 'Sikki grass', 'Water hyacinth', 'Moonj grass', 'Korai grass'],
      },
      {
        name: 'Weave Pattern',
        fieldName: 'weavePattern',
        type: 'dropdown',
        required: false,
        options: ['Plain weave', 'Twill weave', 'Hexagonal weave', 'Coil weave'],
      },
      {
        name: 'Finish',
        fieldName: 'finish',
        type: 'dropdown',
        required: true,
        options: ['Natural / unfinished', 'Lacquered', 'Painted', 'Varnished', 'With fabric lining'],
      },
      {
        name: 'Dimensions',
        fieldName: 'dimensions',
        type: 'dimensions',
        required: true,
        hint: 'Length × Width × Height in cm',
      },
      {
        name: 'Load Capacity',
        fieldName: 'loadCapacity',
        type: 'number',
        required: false,
        unit: 'kg',
        hint: 'For baskets, trays, and furniture',
      },
      {
        name: 'Outdoor Suitable',
        fieldName: 'outdoorSuitable',
        type: 'toggle',
        required: false,
      },
    ],
  },
  {
    id: 'stone-craft',
    name: 'Stone Craft & Sculpture',
    icon: '🗿',
    description: 'Marble inlay, soapstone carving, granite sculpture',
    subCategories: [
      { id: 'marble-inlay', name: 'Marble Inlay Work', hasGiTag: true, giTagName: 'Agra Marble Inlay' },
      { id: 'soapstone', name: 'Soapstone Carvings' },
      { id: 'stone-idols', name: 'Religious Idols & Sculptures' },
      { id: 'stone-decor', name: 'Home Décor (stone)' },
      { id: 'sandstone', name: 'Sandstone & Granite Art' },
      { id: 'stone-tableware', name: 'Natural Stone Tableware' },
    ],
    attributes: [
      {
        name: 'Stone Type',
        fieldName: 'stoneType',
        type: 'dropdown',
        required: true,
        options: ['White marble', 'Makrana marble', 'Soapstone (Baroda)', 'Black granite', 'Sandstone', 'Onyx', 'Semi-precious stone mosaic'],
      },
      {
        name: 'Technique',
        fieldName: 'technique',
        type: 'dropdown',
        required: true,
        options: ['Hand-carved', 'Inlay (Pietra Dura)', 'Polished', 'Engraved', 'Hand-painted on stone'],
      },
      {
        name: 'Finish',
        fieldName: 'finish',
        type: 'dropdown',
        required: true,
        options: ['Polished', 'Unpolished / raw', 'Antique distressed', 'Etched'],
      },
      {
        name: 'Dimensions',
        fieldName: 'dimensions',
        type: 'dimensions',
        required: true,
        hint: 'Length × Width × Height in cm',
      },
      {
        name: 'Weight',
        fieldName: 'weight',
        type: 'number',
        required: true,
        unit: 'kg',
        hint: 'Use kg not grams — stone is heavy. Critical for shipping.',
      },
      {
        name: 'Indoor / Outdoor',
        fieldName: 'indoorOutdoor',
        type: 'dropdown',
        required: false,
        options: ['Indoor only', 'Outdoor suitable', 'Both'],
      },
    ],
  },
  {
    id: 'paper-craft',
    name: 'Paper Craft & Stationery',
    icon: '📖',
    description: 'Handmade paper, Papier-mâché, notebooks, gift wrap',
    subCategories: [
      { id: 'papier-mache', name: 'Papier-mâché Décor', hasGiTag: true, giTagName: 'Kashmir Papier-mâché' },
      { id: 'handmade-paper', name: 'Handmade Paper Products' },
      { id: 'notebooks', name: 'Notebooks & Journals' },
      { id: 'gift-wrap', name: 'Gift Wrap & Packaging' },
      { id: 'paper-sculptures', name: 'Paper Sculptures & Dolls' },
    ],
    attributes: [
      {
        name: 'Paper / Material Type',
        fieldName: 'paperType',
        type: 'dropdown',
        required: true,
        options: ['Papier-mâché', 'Lokta handmade paper', 'Cotton rag paper', 'Recycled paper', 'Banana fibre paper', 'Sugarcane paper'],
      },
      {
        name: 'Technique',
        fieldName: 'technique',
        type: 'dropdown',
        required: true,
        options: ['Papier-mâché (moulded)', 'Hand-stitched binding', 'Block-printed', 'Hand-painted', 'Quilling', 'Origami / folded'],
      },
      {
        name: 'Dimensions',
        fieldName: 'dimensions',
        type: 'text',
        required: true,
        placeholder: 'e.g., A5 / 14.8 × 21 cm',
        hint: 'A5 / A4 / custom for notebooks; L×W×H for 3D items',
      },
      {
        name: 'Pages (for notebooks)',
        fieldName: 'pages',
        type: 'number',
        required: false,
        hint: 'Only for journals and notebooks',
      },
      {
        name: 'Ruled / Unruled (notebooks)',
        fieldName: 'ruledType',
        type: 'dropdown',
        required: false,
        options: ['Blank', 'Ruled', 'Dotted', 'Mixed'],
      },
    ],
  },
  {
    id: 'home-fragrance',
    name: 'Home Fragrance & Ritual Items',
    icon: '🪔',
    description: 'Agarbattis, Attars, natural candles, Puja essentials',
    subCategories: [
      { id: 'agarbatti', name: 'Agarbatti & Dhoop' },
      { id: 'attars', name: 'Attars & Natural Perfumes', hasGiTag: true, giTagName: 'Kannauj Attar' },
      { id: 'candles', name: 'Handmade Candles' },
      { id: 'diyas-clay', name: 'Diyas & Lamps (clay)' },
      { id: 'puja-accessories', name: 'Puja Accessories & Thalis' },
    ],
    attributes: [
      {
        name: 'Product Type',
        fieldName: 'productType',
        type: 'dropdown',
        required: true,
        options: ['Agarbatti sticks', 'Dhoop cones', 'Attar / perfume', 'Candle', 'Diya', 'Puja thali', 'Incense holder'],
      },
      {
        name: 'Fragrance / Scent',
        fieldName: 'fragrance',
        type: 'text',
        required: true,
        placeholder: 'e.g., Rose, Sandalwood, Jasmine, Mogra, Oudh, Vetiver',
      },
      {
        name: 'Base / Ingredients',
        fieldName: 'baseIngredients',
        type: 'multi-select',
        required: false,
        options: ['Charcoal-free', 'Bamboo stick', 'Natural herbs', 'Essential oils', 'Beeswax', 'Soy wax', 'Paraffin-free'],
      },
      {
        name: 'Burn Time',
        fieldName: 'burnTime',
        type: 'number',
        required: false,
        unit: 'hours',
        hint: 'For candles: approximate burn time; for incense: mins per stick',
      },
      {
        name: 'Quantity / Pack Size',
        fieldName: 'packSize',
        type: 'text',
        required: true,
        placeholder: 'e.g., "Pack of 20 sticks" or "10ml bottle"',
      },
      {
        name: 'All-natural / Chemical-free',
        fieldName: 'allNatural',
        type: 'toggle',
        required: false,
        hint: 'High buyer demand for natural products',
      },
    ],
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id);
}

export function getSubCategoryById(categoryId: string, subCategoryId: string): SubCategory | undefined {
  const category = getCategoryById(categoryId);
  return category?.subCategories.find(sub => sub.id === subCategoryId);
}

export function getCategoryAttributes(categoryId: string): CategoryAttribute[] {
  const category = getCategoryById(categoryId);
  return category?.attributes || [];
}

export function getAllAttributes(categoryId: string): CategoryAttribute[] {
  return [...sharedAttributes, ...getCategoryAttributes(categoryId)];
}
