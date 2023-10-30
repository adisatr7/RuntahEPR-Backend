import { Router, Request, Response } from "express"
import db from "../database/index.js"
import handleError from "../handleError.js"
import { Barang } from "../models/BarangModel.js"


// Inisiasi route untuk tabel barang
const barangController = Router()

/**
 * Endpoint untuk mengambil semua data barang
 *
 * TODO: Add pagination!!!
 */
barangController.get("/api/barang", (req: Request, res: Response) => {
    // Ambil semua data barang dari database
    db.select("barang")

        // Jika berhasil, kirim data barang ke client
        .then((data) => {
            res.json(data)
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
//     if (items.length === 0 || !items) {
//         res.json(handleError(new Error("No item found")))
//         return
//     }

//     try {
//         items.forEach((item, index) => {
//             // Pisahkan ID dari data barang
//             const { kodeItem } = item
//             delete item.kodeItem

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
//             detail: "All items has been added!"
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