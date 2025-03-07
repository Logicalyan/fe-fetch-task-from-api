import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import useEditUser from '@/hooks/useEditUser';

const ModalsEdit = (props) => {
    const { open, setOpen, editUser, setEditUser, handleEdit } = props
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Label>Name</Label>
                    <Input value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
                    <Label>Email</Label>
                    <Input value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} />
                    <Button className="w-full" onClick={handleEdit}>Save Changes</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ModalsEdit