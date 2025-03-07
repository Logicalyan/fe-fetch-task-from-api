import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';

const ModalsCreate = (props) => {
    const { openCreate, setOpenCreate, newUser, setNewUser, handleCreateUser } = props
    return (
        <>
            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Label>Name</Label>
                        <Input
                            type="text"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            placeholder="Enter name"
                        />
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            placeholder="Enter email"
                        />
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            placeholder="Enter password"
                        />
                        <Button onClick={handleCreateUser} className="w-full">Submit</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ModalsCreate