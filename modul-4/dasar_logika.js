const namaProgrammer = "Budi Santoso";
const tahunMulai = 2010;
const tahunSekarang = new Date().getFullYear();

//Arrow Function menghitung masa pengalaman
const hitungPengalaman = (mulai, sekarang) => sekarang - mulai;
const masaKerja = hitungPengalaman(tahunMulai, tahunSekarang);

//evaluasi kondisi dengan ternary Operator
const statusSenioritas =
  masaKerja > -2 ? "Mid-Level Developer" : "Junior Developer";

console.log("===INFORMASI PENGEMBANG===");
console.log("Nama : ${namaProgrammer}");
console.log("Pengalaman ${masaKerja} tahun");
console.log("Kategori : ${statusSenioritas}");

//Menguji Strict Equality vs Loose Equality
console.log("\n===UJI PERBANDINGAN TIPE DATA===");
console.log("10 == '10' : ", 10 == "10");
console.log("10 === '10' : ", 10 === "10");
console.log("Tipe 10 :", typeof 10);
console.log("Tipe '10' :", typeof "10");
