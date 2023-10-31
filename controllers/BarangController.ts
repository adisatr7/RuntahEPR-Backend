import { Router, Request, Response } from "express"
import db from "../database/index.js"
import handleError from "../utils/handleError.js"
import { Barang } from "../models/BarangModel.js"


// Inisiasi route untuk tabel barang
const barangController = Router()

/**
 * Endpoint untuk mengambil semua data barang
 */
barangController.get("/api/barang", (req: Request, res: Response) => {

    // Ambil parameter pagination dari URL
    const page = parseInt(req.query.page as string)
    const limit = parseInt(req.query.limit as string)

    // Jika parameter pagination tidak ditemukan, tampilkan pesan error
    if (!page || !limit)
        return res.json({
            status: "Error",
            detail: "Please provide the parameter `page` and `limit`!",
            example: "api/barang?page=2&limit=10"
        })

    // Ambil semua data barang dari database
    db.query("SELECT * FROM barang ORDER BY nama ASC LIMIT ($limit) START ($start)", {
        limit,
        start: page * limit
    })

        // Jika berhasil, kirim data barang ke client
        .then(async (data) => {

            // Ambil total data barang
            const queryResult: any = await db.query("SELECT count() FROM barang GROUP BY count")
            const totalData: number = queryResult[0].result[0]?.count || 0

            let action: any = {
                currentPage: page,
                next: `api/barang?page=${page + 1}&limit=${limit}`,
                totalData,
                totalPages: Math.ceil(totalData / limit)
            }

            if (page > 1)
                action.prev = `api/barang?page=${page - 1}&limit=${limit}`

            res.json({
                data: data[0].result,
                action
            })
        })

        // Jika terjadi error, kirim pesan error ke client
        .catch((error) => {
            res.json(handleError(error))
        })
})

/**
 * Endpoint untuk mengambil data barang berdasarkan ID
 */
barangController.get("/api/barang/:id", (req: Request, res: Response) => {
    // Ambil id dari parameter
    const { id } = req.params

    // Ambil data barang dari database
    db.select(`barang:${id}`)

        // Jika berhasil
        .then((data) => {
            // Jika data barang ditemukan
            if (data.length > 0) {
                // Gabungkan ID dengan data barang
                const result = { ...data[0], kodeItem: id }

                // kirim data barang ke client
                res.json(result)
            }

            // Jika terjadi error, lempar error ke catch
            else
                res.json(handleError(new Error(`Item of ID ${id} not found`)))
        })

        // Jika terjadi error, kirim pesan error ke client
        .catch((error) => {
            res.json(handleError(error))
        })
})



barangController.get("/api/scan/:barcode", (req: Request, res: Response) => {
    // Ambil id dari parameter
    const { barcode } = req.params

    // Ambil data barang dari database
    db.query("SELECT * FROM barang WHERE barcode = ($barcode)", { barcode })

        // Jika berhasil
        .then((data) => {
            // Jika data barang ditemukan
            if (data.length > 0) {
                // Gabungkan ID dengan data barang
                const result = { ...data[0], barcode: barcode }

                // kirim data barang ke client
                res.json(result)
            }

            // Jika terjadi error, lempar error ke catch
            else
                res.json(handleError(new Error(`Item of ID ${barcode} not found`)))
        })

        // Jika terjadi error, kirim pesan error ke client
        .catch((error) => {
            res.json(handleError(error))
        })
})


/**
 * Endpoint untuk menambahkan data barang
 *
 * ! Untested
 */
barangController.post("/api/barang", (req: Request, res: Response) => {
    // Ambil data barang dari body
    const barang: Barang = req.body

    // Jika data barang kosong, kirim pesan error ke client
    if (!barang) {
        res.json(handleError(new Error("No item found")))
        return
    }

    // Pisahkan ID dari data barang
    const { kodeItem } = barang
    delete barang.kodeItem

    // Masukkan data barang ke database
    db.insert(`barang:${kodeItem}`, { ...barang })

        // Jika berhasil, kirim pesan sukses ke client
        .then(() => {
            res.json({
                status: "OK",
                detail: "Barang has been added!",
                result: { ...barang }
            })
        })

        // Jika terjadi error, kirim pesan error ke client
        .catch((error) => {
            res.json(handleError(error))
        })
})


/**
 * Endpoint untuk mengubah data barang
 *
 * ! Untested
 */
barangController.patch("/api/barang/:id", (req: Request, res: Response) => {
    // Ambil id dari parameter
    const { id } = req.params

    // Ambil data barang dari body
    const barang: Barang = req.body

    // Pisahkan ID dari data barang
    delete barang.kodeItem

    // Ubah data barang di database
    db.update(`barang:${id}`, { ...barang })

        // Jika berhasil, kirim pesan sukses ke client
        .then(() => {
            res.json({
                status: "OK",
                detail: "Barang has been updated!",
                result: { ...barang }
            })
        })

        // Jika terjadi error, kirim pesan error ke client
        .catch((error) => {
            res.json(handleError(error))
        })
})


/**
 * Endpoint untuk menghapus data barang
 *
 * ! Untested
 */
barangController.delete("/api/barang/:id", (req: Request, res: Response) => {
    // Ambil id dari parameter
    const { id } = req.params

    // Hapus data barang di database
    db.delete(`barang:${id}`)

        // Jika berhasil, kirim pesan sukses ke client
        .then(() => {
            res.json({
                status: "OK",
                detail: `Barang of ID ${id} has been deleted!`
            })
        })

        // Jika terjadi error, kirim pesan error ke client
        .catch((error) => {
            res.json(handleError(error))
        })
})


/**
 * ! DEV ONLY: Endpoint untuk menambah banyak data barang
 */
// barangController.post("/api/barang/bulk", (req: Request, res: Response) => {

//     // Ambil data barang dari body
//     const items: Barang[] = req.body

//     // Jika data barang kosong, kirim pesan error ke client
//     if (items.length === 0 || !items || !items[0]) {
//         res.json(handleError(new Error("No item found")))
//         return
//     }

//     try {
//         items.forEach((item, index) => {
//             // Pisahkan ID dari data barang
//             const { kodeItem } = item
//             delete item.kodeItem

//             // Konversi data ke tipe data number
//             item.konversiSatuanDasar = parseInt(item.konversiSatuanDasar as string)
//             item.hargaPokok = parseInt(item.hargaPokok as string)
//             item.hargaJual = parseInt(item.hargaJual as string)
//             item.stok = parseInt(item.stok as string)
//             item.stokMinimum = parseInt(item.stokMinimum as string)

//             // Masukkan data barang ke database
//             db.create(`barang:${kodeItem}`, { ...item })

//                 // Jika berhasil, kirim pesan sukses ke client
//                 .then(() => {
//                     console.log(`(${index + 1}/${items.length}) Barang of ID ${kodeItem} has been added!`, item)
//                 })

//                 // Jika terjadi error, lempar error ke catch di luar
//                 .catch((error) => {
//                     throw new Error(`(${index + 1}/${items.length}) ${error.message}`)
//                 })
//         })

//         // Jika berhasil, kirim pesan sukses ke client
//         res.json({
//             status: "OK",
//             detail: `${items.length} item(s) has been added!`
//         })
//     }

//     // Jika terjadi error, kirim pesan error ke client
//     catch (error) {
//         res.json(handleError(error as Error))
//     }
// })

/**
 * ! DEV ONLY: Endpoint untuk menghapus semua data barang
 */
// barangController.delete("/api/barang", (req: Request, res: Response) => {
//     // Hapus semua data barang di database
//     db.delete("barang")

//         // Jika berhasil, kirim pesan sukses ke client
//         .then(() => {
//             res.json({
//                 status: "OK",
//                 detail: "All items has been deleted!"
//             })
//         })

//         // Jika terjadi error, kirim pesan error ke client
//         .catch((error) => {
//             res.json(handleError(error))
//         })
// })

export default barangController