import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { firestore } from "../firebase-client";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import { IconButton } from "@material-tailwind/react";
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import DocumentTable from "../components/DocumentTable";
import CreateNewDocumentModal from "../components/CreateNewDocumentModal";

const Home = () => {
  const { user } = useContext(AuthContext);

  let [isOpen, setIsOpen] = useState(false);
  const [newDocumentName, updateNewDocumentName] = useState("");
  const [tableData, updateTableData] = useState([]);

  function closeModal() {
    setIsOpen(false);
    updateNewDocumentName("");
  }

  function openModal() {
    setIsOpen(true);
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    } else {
      console.log(user);
    }
  }, [navigate, user]);

  const createNewDocument = async () => {
    if (newDocumentName === "") return;

    const document = {
      name: newDocumentName,
      owner: user.email,
      allowed: [user.email],
      timestamp: serverTimestamp(),
      content: "",
      locked: false,
    };
    const createdDocRef = await addDoc(collection(firestore, "document"), document);

    console.log(createdDocRef);

    // console.log(addedDocument);
    updateNewDocumentName("");
    // updateShowCreateModal(false);
    closeModal();

    // router.push(`/document/${createdDocRef.id}`);
    navigate(`/document/${createdDocRef.id}`);
  };

  useEffect(() => {
    if (user === null) return;

    async function fetchDocuments() {
      const q = query(collection(firestore, "document"), where("allowed", "array-contains", user.email));
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot);

      let tableDataArr = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        let tempRow = {
          id: doc.id,
          name: data.name,
          status: data.owner === user.email ? "Owner" : "Shared",
          createdOn: new Date(data.timestamp.seconds * 1000).toLocaleDateString(),
        };

        tableDataArr.push(tempRow);
      });

      updateTableData(tableDataArr);
    }

    fetchDocuments();
  }, [user]);

  const deleteDocument = async (id) => {
    const documentRef = doc(firestore, "document", id);
    await deleteDoc(documentRef);
  };

  // const tailwindModal = (
  //   <>
  //     <Transition appear show={isOpen} as={Fragment}>
  //       <Dialog as='div' className='relative z-10' onClose={closeModal}>
  //         <Transition.Child
  //           as={Fragment}
  //           enter='ease-out duration-300'
  //           enterFrom='opacity-0'
  //           enterTo='opacity-100'
  //           leave='ease-in duration-200'
  //           leaveFrom='opacity-100'
  //           leaveTo='opacity-0'>
  //           <div className='fixed inset-0 bg-black bg-opacity-25' />
  //         </Transition.Child>

  //         <div className='fixed inset-0 overflow-y-auto'>
  //           <div className='flex min-h-full items-center justify-center p-4 text-center'>
  //             <Transition.Child
  //               as={Fragment}
  //               enter='ease-out duration-300'
  //               enterFrom='opacity-0 scale-95'
  //               enterTo='opacity-100 scale-100'
  //               leave='ease-in duration-200'
  //               leaveFrom='opacity-100 scale-100'
  //               leaveTo='opacity-0 scale-95'>
  //               <Dialog.Panel className='w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all'>
  //                 <input
  //                   value={newDocumentName}
  //                   onChange={(e) => updateNewDocumentName(e.target.value)}
  //                   type='text'
  //                   placeholder='Enter name for new document'
  //                   className='outline-none w-full'
  //                   onKeyDown={(e) => e.key === "Enter" && createNewDocument()}
  //                 />

  //                 <div className='mt-2 flex justify-end'>
  //                   <Button
  //                     className='mr-2 p-2 border-0'
  //                     ripple={true}
  //                     color='blue'
  //                     variant='outlined'
  //                     onClick={() => closeModal()}>
  //                     Cancel
  //                   </Button>

  //                   <Button className='p-2' ripple={true} color='blue' onClick={() => createNewDocument()}>
  //                     Create
  //                   </Button>
  //                 </div>
  //               </Dialog.Panel>
  //             </Transition.Child>
  //           </div>
  //         </div>
  //       </Dialog>
  //     </Transition>
  //   </>
  // );

  return (
    <>
      {user && (
        <>
          <div>
            <Header image={user.photoURL} />
            <section className='bg-[#F8F9FA] pb-10 px-10'>
              <div className='max-w-3xl mx-auto'>
                <div className='flex items-center justify-between py-6'>
                  <h2 className='text-gray-700 text-lg'>Start a new Document</h2>

                  <IconButton
                    color='gray'
                    variant='outlined'
                    ripple
                    className='border-0 rounded-full focus:shadow-none'>
                    <i className='fa-solid fa-ellipsis-vertical text-xl'></i>
                  </IconButton>
                </div>
                <div>
                  <div className='relative h-32 w-24 md:h-48 md:w-36 border-2 cursor-pointer hover:border-blue-700'>
                    <img
                      className='h-full'
                      src='/images/docs-blank-googlecolors.png'
                      alt='New Document'
                      onClick={() => {
                        // updateShowCreateModal(true);
                        openModal();
                      }}
                    />
                  </div>
                  <p className='ml-2 mt-2 font-semibold text-sm text-gray-700'>Blank</p>
                </div>
              </div>
            </section>

            <section className='bg-white px-10 md:px-0'>
              <div className='max-w-3xl mx-auto py-2 text-sm text-gray-700'>
                <div className='flex items-center justify-between pb-2'>
                  <h2 className='font-medium flex-grow text-lg'>My Documents</h2>
                  {/* <p className='mr-10'>Date Created</p> */}
                  {/* <i className='fa-solid fa-folder text-xl' style={{ color: "gray" }}></i> */}
                </div>
              </div>
            </section>

            <DocumentTable data={tableData} deleteDocument={deleteDocument} />
          </div>
          {/* {tailwindModal} */}
          <CreateNewDocumentModal
            isOpen={isOpen}
            closeModal={closeModal}
            createNewDocument={createNewDocument}
            newDocumentName={newDocumentName}
            updateNewDocumentName={updateNewDocumentName}
          />
        </>
      )}
    </>
  );
};

export default Home;
