import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState } from 'react';

export default function Index({ auth, department, branch, staff }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        status: 'OFFLINE',
    });

    const openCreateModal = () => {
        reset();
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        reset();
    };

    const openEditModal = (staffMember) => {
        setEditingStaff(staffMember);
        setData({
            name: staffMember.name,
            status: staffMember.status,
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingStaff(null);
        reset();
    };

    const storeStaff = (e) => {
        e.preventDefault();
        post(route('staff.store', department.id), {
            onSuccess: () => closeCreateModal(),
        });
    };

    const updateStaff = (e) => {
        e.preventDefault();
        put(route('staff.update', editingStaff.id), {
            onSuccess: () => closeEditModal(),
        });
    };

    const deleteStaff = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar este miembro del personal?')) {
            destroy(route('staff.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Personal - {department.name} ({branch.name})
                    </h2>
                    <div className="flex gap-4">
                        <Link
                            href={route('departments.index', branch.id)}
                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            Volver a Departamentos
                        </Link>
                        <PrimaryButton onClick={openCreateModal}>
                            Agregar Personal
                        </PrimaryButton>
                    </div>
                </div>
            }
        >
            <Head title={`Personal - ${department.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código QR</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {staff.map((member) => (
                                        <tr key={member.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    member.status === 'ONLINE' ? 'bg-green-100 text-green-800' : 
                                                    member.status === 'ON_BREAK' ? 'bg-yellow-100 text-yellow-800' : 
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {member.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.qr_hash}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => openEditModal(member)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                                    Editar
                                                </button>
                                                <button onClick={() => deleteStaff(member.id)} className="text-red-600 hover:text-red-900">
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {staff.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                No hay personal registrado en este departamento.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isCreateModalOpen} onClose={closeCreateModal}>
                <form onSubmit={storeStaff} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Agregar Personal</h2>
                    <div className="mt-4">
                        <InputLabel htmlFor="name" value="Nombre" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeCreateModal}>Cancelar</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>Guardar</PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={isEditModalOpen} onClose={closeEditModal}>
                <form onSubmit={updateStaff} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Editar Personal</h2>
                    <div className="mt-4">
                        <InputLabel htmlFor="edit_name" value="Nombre" />
                        <TextInput
                            id="edit_name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="status" value="Estado" />
                        <select
                            id="status"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                        >
                            <option value="ONLINE">Online</option>
                            <option value="OFFLINE">Offline</option>
                            <option value="ON_BREAK">En Pausa</option>
                        </select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeEditModal}>Cancelar</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={processing}>Actualizar</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
