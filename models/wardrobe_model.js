module.exports = (sequelize, DataTypes) => {

    const Wardrobe = sequelize.define("wardrobe", {
        user_id: {
            type: DataTypes.INTEGER
        },
        category: {
            type: DataTypes.ENUM('Top', 'Bottom', 'Set', 'Shoes', 'Accessory'),
        },
        sub_category: {
            type: DataTypes.ENUM('Skirts', 'Shorts', 'Trousers', 'None'),
            defaultValue: 'None'
        },
        color: {
            type: DataTypes.ENUM('Brown', 'Yellow', 'Purple', 'Orange', 'Green', 'Pink', 'Blue', 'Red', 'White', 'Beige', 'Black', 'Grey', 'Multi'),
        },
        type: {
            type: DataTypes.ENUM(
                'Bardot', 'Camisole', 'Cardigans', 'Coat', 'Crop', 'Hoodie', 'Jacket', 'Polo', 'Sleeveless', 'Suit', 'Shirt', 'Sweater', 'Transparent Top', 'T Shirt', 'Tube Top', 'Tunics', 'Turtleneck', 'Vest', 'Waistcoat', 'Wrap Top',
                'Biker', 'Shorts', 'Cargo', 'Harem', 'Leather', 'Skinny', 'Skort', 'Straight Lag', 'Track Shorts', 'Wide Leg',
                'Baggy', 'Flare Leg', 'Jogger', 'Legging',
                'A Line', 'Asymmetrical', 'Balloon', 'Denim', 'Draped', 'Godet', 'Gypsy', 'Layered', 'Mermaid', 'Pencil', 'Pleated', 'Slit', 'Tulip', 'Tulle', 'Wrap',
                'Bathrobes', 'Beachwear', 'Bodysuit', 'Dungaree', 'Jumpsuits', 'Maxi Dress', 'Mini Dress', 'Pinafore', 'Playsuits', 'Pyjamas',
                'Ballerinas', 'Boots', 'Crocs', 'Espadrilles', 'Flip Flops', 'Formal', 'Mary Jane', 'Mules', 'Pumps', 'Sandals', 'Slippers', 'Sneakers',
                'Bag', 'Belt', 'Bracelets', 'Brooches', 'Cufflinks', 'Earrings', 'Glasses', 'Gloves', 'Hat', 'Headband', 'Necklaces', 'Ring', 'Scarf', 'Sock', 'Stockings', 'Tie', 'Watch'
            ),
        },
        is_favorite: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        wardrobe_img: {
            type: DataTypes.STRING
        }
    },
    {
        paranoid: true
    })

    return Wardrobe
}