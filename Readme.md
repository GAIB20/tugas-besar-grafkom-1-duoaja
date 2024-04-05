# Tugas Besar 1 - IF3260 Grafika Komputer

## K3 - Kelompok 10 (duoAja)
| NIM      | Nama                           |
|----------|--------------------------------|
| 13521004 | Henry Anand Septian Radityo    |
| 13521015 | Hidayatullah Wildan Ghaly B    |

## Cara Menjalankan Program
Dibawah ini merupakan cara menjalankan program dengan menggunakan node server, program juga dapat dijalankan dengan server lain sesuai dengan preferensi. 

### Node Server
Prerequisite:
- Node JS 

Tahapan : 
- `npm install -g http-server` apabila belum menginstall node server
- `http-server` di direktori src untuk menjalankan program
- Program akan berjalan secara default di `http://127.0.0.1:8080`

## Transformasi:
Transformasi memanfaatkan kelas shearManager yang berisi fungsi-fungsi transformasi yang dapat digunakan untuk mengubah bentuk yang ada di canvas. Transformasi yang dapat dilakukan adalah sebagai berikut
### Translasi
Translasi dilakukan dengan menambah nilai x dan y dengan dx dan dy
```
x = x + dx
y = y + dy
```

### Shear
Shear dilakukan dengan menambah nilai x dan y dengan faktor tertentu dengan memanfaatkan rata-rata x dan y dari bentuk yang sedang dishear
```
x = x + (x - AVG(x)) * factor
y = y + (y - AVG(y)) * factor
```

### Rotasi
Rotasi dilakukan dengan rumus berikut untuk memutar bentuk objek
```
angle  = factor * (PI/180)
x = AVG(x) + (x - AVG(x)) * cos(angle) - (y - AVG(y)) * sin(angle)
y = AVG(y) + (y - AVG(y)) * cos(angle) + (x - AVG(x)) * sin(angle)
```

### Perubahan koordinat titik
Jika bangun merupakan rectangle atau garis maka index dijadikan corner kebalikan dari index saat ini untuk mendapatkan anchor (koordinat index)
```
x = x + (x - anchor) * factor
y = y + (y - anchor) * factor
```

### Memperbesar objek sebangun
Memanfaatkan slider lalu memanggil perubahaan koordinat titik x dan y bersamaan

### Refleksi
Mendapatkan median dari x dan y sebagai batas refleksi untuk refleksi x dan y
``` 
x = x - 2 * (x - median)
y = y - 2 * (y - median)
```

### Dilatasi
Dilatasi dilakukan untuk memperbesar bangun saat ini ke seluruh arah
```
x = x + (x - AVG(x)) * factor
y = y + (y - AVG(y)) * factor
```