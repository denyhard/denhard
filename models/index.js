const { Sequelize } = require("sequelize");

// Konfigurasi koneksi database
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  logging: false, // Set true untuk melihat log SQL di console
  define: {
    // Default options for all models
    timestamps: false, // Contoh: nonaktifkan timestamps jika tidak diperlukan
  },
});

// Mengimpor model
// const User = require("./user")(sequelize);
// const Journal = require("./journal")(sequelize);

// Hubungan antar model, jika ada
// Contoh: User.hasMany(Journal);
// Journal.belongsTo(User);

sequelize
  .sync({ alter: false })
  .then(() => {
    console.log("Database dan tabel telah disinkronkan");
  })
  .catch((error) => {
    console.error("Error saat sinkronisasi database:", error);
  });

module.exports = {
  sequelize,
  //   User,
  //   Journal,
};
