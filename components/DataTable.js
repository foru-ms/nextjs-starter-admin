import { useTable, usePagination } from 'react-table';
import { deleteData, createData, updateData } from '../utils/api';
import { useState } from 'react';
import Modal from 'react-modal';

// components/DataTable.js

Modal.setAppElement('#__next'); // Set the root element for accessibility

const DataTable = ({ columns, data, model }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        state,
        setPageSize,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        usePagination
    );

    const { pageIndex, pageSize } = state;

    const [formData, setFormData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [editRowId, setEditRowId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    const handleDelete = async (id) => {
        await deleteData(model, id);
        // Optionally, refetch data to update the table
        // fetchModelData();
    };

    const handleCreate = async () => {
        await createData(model, formData);
        // Optionally, refetch data to update the table
        // fetchModelData();
    };

    const handleUpdate = async (id) => {
        await updateData(model, id, editFormData);
        // Optionally, refetch data to update the table
        //fetchModelData();
    };

    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
    };

    const handleEditChange = (e, columnId) => {
        const value = e.target.value;
        setEditFormData((prev) => ({
            ...prev,
            [columnId]: value,
        }));
    };

    const handleEditClick = (row) => {
        console.log('Editing row:', row);
        setEditRowId(row.original.id);
        setEditFormData(row.original);
    };

    const handleSaveClick = async (id) => {
        console.log('Saving row:', id, editFormData);
        await handleUpdate(id);
        setEditRowId(null);
    };

    const handleCancelClick = () => {
        console.log('Cancelling edit');
        setEditRowId(null);
        setEditFormData({});
    };

    return (
        <>
            <table {...getTableProps()} className="w-full border-collapse">
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()} className="p-2 border-b-2 border-gray-300">
                                    {column.render('Header')}
                                </th>
                            ))}
                            <th className="p-2 border-b-2 border-gray-300">Actions</th>
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <td {...cell.getCellProps()} className="p-2 border-b border-gray-300">
                                        {editRowId === row.original.id ? (
                                            cell.column.id === 'id' ? (
                                                cell.render('Cell')
                                            ) : cell.column.id === 'extendedData' ? (
                                                <textarea
                                                    value={JSON.stringify(editFormData[cell.column.id] || '', null, 2)}
                                                    onChange={(e) => handleEditChange(e, cell.column.id)}
                                                    className="w-3/4 p-2 border border-gray-300 rounded-md"
                                                    rows={5}
                                                />
                                            ) : typeof cell.value === 'object' && cell.value !== null ? (
                                                cell.render('Cell')
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={editFormData[cell.column.id] || ''}
                                                    onChange={(e) => handleEditChange(e, cell.column.id)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                                />
                                            )
                                        ) : (
                                            typeof cell.value === 'object' && cell.value !== null ? (
                                                <button
                                                    onClick={() => openModal(cell.value)}
                                                    className="text-blue-500 underline"
                                                >
                                                    View JSON
                                                </button>
                                            ) : (
                                                cell.render('Cell')
                                            )
                                        )}
                                    </td>
                                ))}
                                <td className="p-2 border-b border-gray-300">
                                    {editRowId === row.original.id ? (
                                        <>
                                            <button
                                                onClick={() => handleSaveClick(row.original.id)}
                                                className="text-green-500 underline mr-2"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelClick}
                                                className="text-gray-500 underline"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEditClick(row)}
                                                className="text-blue-500 underline mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(row.original.id)}
                                                className="text-red-500 underline"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="flex items-center justify-between mt-4">
                <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    className="px-4 py-2 text-white bg-blue-500 rounded-md disabled:bg-gray-300"
                >
                    Previous
                </button>
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <button
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    className="px-4 py-2 text-white bg-blue-500 rounded-md disabled:bg-gray-300"
                >
                    Next
                </button>
                <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md"
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="JSON Viewer">
                <h2 className="text-xl font-bold">JSON Data</h2>
                <pre className="mt-2">{JSON.stringify(modalContent, null, 2)}</pre>
                <button
                    onClick={closeModal}
                    className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md"
                >
                    Close
                </button>
            </Modal>
        </>
    );
};

export default DataTable;
