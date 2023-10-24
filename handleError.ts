/**
 * Tampilkan error yang terjadi.
 *
 * @param error Pesan error
 */
export default function handleError (error: Error) {
    // Ambil timestamp saat ini
    const timestamp = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
    })

    // Tampilkan error di console
    console.error(`\n${timestamp} - An error occured`, error)

    // Kirim pesan error ke client
    return {
        message: "An error occured",
        error: error.message,
        timestamp: new Date().toISOString()
    }
}