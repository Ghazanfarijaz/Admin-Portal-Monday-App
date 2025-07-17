import * as XLSX from "xlsx";
import { toast } from 'sonner'
/**
 * Parses an Excel file and extracts cleaned rows with name, email, and password.
 * Handles case-insensitive column headers.
 *
 * @param {File} file - The uploaded Excel file.
 * @returns {Promise<Array<{name: string, email: string, password: string}>>}
 */
export const parseExcelFile = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet);

                const cleaned = json
                    .map((row) => {
                        const keys = Object.keys(row).reduce((acc, key) => {
                            acc[key.toLowerCase()] = row[key];
                            return acc;
                        }, {});

                        return {
                            name: keys.name?.toString().trim(),
                            email: keys.email?.toString().trim(),
                            password: keys.password?.toString().trim(),
                        };
                    })
                    .filter(
                        (row) =>
                            row.name &&
                            row.email &&
                            row.password &&
                            row.name !== "" &&
                            row.email !== "" &&
                            row.password !== ""
                    );

                resolve(cleaned);
            } catch (err) {
                reject(err);
            }
        };

        reader.onerror = () => {
            reject(reader.error)
            toast.error("Error reading file")
        };
        reader.readAsArrayBuffer(file);
    });
};