DB_CONFIG = {
    //db: "mongodb+srv://FastMart_DB:pT5Rwf0qTgGxd6g2@fastmartcluster.niafikb.mongodb.net/?retryWrites=true&w=majority",
    db: "mongodb://localhost/MyDatabase",
    PAGE_SIZE: 10
};

const STRIPE_CONFIG = {
    STRIPE_KEY : "sk_test_51LjdB8CiUE6D0lAiyzp5xZAoiy4fsRY9qDfMlePMe51MroIgHvu2PBxUe4Uf60GqQYyCLhIXZhlpSQe1pnumhqdD00deW2BuLR",
    CURRENCY : "pkr"
}

module.exports ={
    DB_CONFIG,
    STRIPE_CONFIG
}