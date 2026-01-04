let barang = JSON.parse(localStorage.getItem("barang")) || [];

function simpan() {
    localStorage.setItem("barang", JSON.stringify(barang));
    tampilkanBarang();
}

function tampilkanBarang() {
    const tbody = document.getElementById("dataBarang");
    tbody.innerHTML = "";

    barang.forEach((item, index) => {
        const warningClass = item.stok < 50 ? "stok-warning" : "";

        tbody.innerHTML += `
            <tr class="${warningClass}">
                <td>${item.kode}</td>
                <td>${item.nama}</td>
                <td>${item.harga}</td>
                <td>${item.stok}</td>
                <td>${item.restock}</td>
                <td>${item.jual}</td>
                <td>Rp ${item.total}</td>
                <td>
                    <button class="btn-restock" onclick="restock(${index})">Restock</button>
                    <button class="btn-sell" onclick="jual(${index})">Jual</button>
                    <button class="btn-delete" onclick="hapusBarang(${index})">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function tambahBarang() {
    const kodeBarang = document.getElementById("kodeBarang");
    const namaBarang = document.getElementById("namaBarang");
    const hargaBarang = document.getElementById("hargaBarang");
    const stokBarang = document.getElementById("stokBarang");

    if (!kodeBarang.value || !namaBarang.value || !hargaBarang.value || !stokBarang.value) {
        alert("Semua data wajib diisi!");
        return;
    }

    if (stokBarang.value < 50) {
        alert("Stok awal minimal 50!");
        return;
    }

    barang.push({
        kode: kodeBarang.value,
        nama: namaBarang.value,
        harga: Number(hargaBarang.value),
        stok: Number(stokBarang.value),
        restock: 0,
        jual: 0,
        total: 0
    });

    simpan();
    document.querySelectorAll("input").forEach(i => i.value = "");
}

function restock(index) {
    const jumlah = prompt("Masukkan jumlah restock:");
    if (!jumlah || jumlah <= 0) return;

    barang[index].stok += Number(jumlah);
    barang[index].restock = Number(jumlah);

    simpan();
}

function jual(index) {
    const item = barang[index];
    const jumlah = prompt(
        "Barang : " + item.nama +
        "\nHarga  : " + item.harga +
        "\nStok   : " + item.stok +
        "\n\nMasukkan jumlah jual:"
    );

    if (!jumlah || jumlah <= 0) return;
    if (jumlah > item.stok) {
        alert("Stok tidak mencukupi!");
        return;
    }

    item.stok -= Number(jumlah);
    item.jual = Number(jumlah);
    item.total = Number(jumlah) * item.harga;

    alert("Total Penjualan: Rp " + item.total);

    if (item.stok < 50) {
        alert("⚠️ PERINGATAN!\nStok barang kurang dari 50.\nSegera lakukan restock.");
    }

    simpan();
}

function hapusBarang(index) {
    if (confirm("Yakin ingin menghapus barang?")) {
        barang.splice(index, 1);
        simpan();
    }
}

function downloadExcel() {
    const data = [
        ["Kode", "Nama", "Harga", "Stok", "Restock Terakhir", "Jual Terakhir", "Total Penjualan"]
    ];

    barang.forEach(b => {
        data.push([
            b.kode,
            b.nama,
            b.harga,
            b.stok,
            b.restock,
            b.jual,
            b.total
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Kasir");

    XLSX.writeFile(wb, "laporan_kasir.xlsx");
}

tampilkanBarang();
