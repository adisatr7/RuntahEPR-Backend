export interface Barang {
    kodeItem: string
    barcode: string
    namaItem: string
    jenis: string
    satuan: string
    merek: string
    satuanDasar: string
    konversiSatuanDasar: number
    hargaPokok: number
    hargaJual: number
    stok: number
    stokMinimum: number
    tipeItem: string
    menggunakanSerial: string
    rak: string
    kodeGudangKantor: string
    kodeSupplier: string
    keterangan: string
}