export interface Barang {
    kodeItem?: string
    barcode: string
    namaItem: string
    jenis: string
    satuan: string
    merek: string
    satuanDasar: string
    konversiSatuanDasar: number | string
    hargaPokok: number | string
    hargaJual: number | string
    stok: number | string
    stokMinimum: number | string
    tipeItem: string
    menggunakanSerial: string
    rak: string
    kodeGudangKantor: string
    kodeSupplier: string
    keterangan: string
}