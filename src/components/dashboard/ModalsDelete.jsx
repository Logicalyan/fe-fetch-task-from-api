import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

const ModalsDelete = (props) => {
    const { openDelete, setOpenDelete, handleDelete } = props
    return (
        <>
            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
                    </DialogHeader>
                    <p>Apakah kamu yakin ingin menghapus user ini?</p>
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setOpenDelete(false)}>Batal</Button>
                        <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ModalsDelete