/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Preloader from '../../utils/preloader/preloader';
import '../../pages/allResources/allResources.scss'
import LibaModal from '../libaModal/libaModal';
import Pagination from '../pagination/pagination';
import LibaNotification from '../libaNotification/libaNotification';
import ResourceWrapper from '../resourceWrapper/resourceWrapper';
import 'animate.css';

const CategoryComponent = ({ categoryName, baseURL, getParams, actionInfoSections=false, actionSection=false, itemsToShow, searchInclude=false, pagination=false, pageSize, fixHeight=false}) => {
    const [allResources, setAllResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [requestIsLoading, setRequestIsLoading] = useState(false);
    const [idOfResource, setIdOfResource] = useState("");
    const [searchParametrs, setSearchParametrs] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [resourcesPerPage] = useState(pageSize || 5);

    const [resourceName, setResourceName] = useState("");
    const [resourceLink, setResourceLink] = useState("");
    const [resourceCategory, setResourceCategory] = useState("");

    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [editResourceName, setEditResourceName] = useState("");
    const [editResourceLink, setEditResourceLink] = useState("");
    const [editResourceCategory, setEditResourceCategory] = useState("");
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

    const [addSuccessNotificationIsOpen, setAddSuccessNotificationIsOpen] = useState(false);
    const [addErrorNotificationIsOpen, setAddErrorNotificationIsOpen] = useState(false);

    const [editSuccessNotificationIsOpen, setEditSuccessNotificationIsOpen] = useState(false);
    const [editErrorNotificationIsOpen, setEditErrorNotificationIsOpen] = useState(false);

    const [deleteSuccessNotificationIsOpen, setDeleteSuccessNotificationIsOpen] = useState(false);
    const [deleteErrorNotificationIsOpen, setDeleteErrorNotificationIsOpen] = useState(false);

    const [matchesNotificationIsOpen, setMatchesNotificationIsOpen] = useState(false);

    const searchArray = allResources.filter(resource => resource.name.includes(searchParametrs));
    const lastResourceIndex = currentPage * resourcesPerPage;
    const firstResourseIndex = lastResourceIndex - resourcesPerPage;
    const currentResources = searchArray.slice(firstResourseIndex, lastResourceIndex);

    const paginate = pageNumbers => {setCurrentPage(pageNumbers)}

    const prevPage = () => {
        setCurrentPage(pageNumber => pageNumber === 1 ? 1 : pageNumber - 1)
    }

    const nextPage = () => {
        setCurrentPage(pageNumber =>
            pageNumber === Math.ceil(searchArray.length / resourcesPerPage) ?
                pageNumber : pageNumber + 1)
    }

    useEffect(async () => {
        if (itemsToShow) {
            try {
                await axios.get(baseURL, {params: getParams})
                .then((response) => {
                    const newArray = response.data;
                    const reverseArray = newArray.reverse().slice(0, itemsToShow);
                    setAllResources(reverseArray);
                    setIsLoading(false);
                })
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                await axios.get(baseURL, {params: getParams})
                .then((response) => {
                    const newArray = response.data;
                    const reverseArray = newArray.reverse();
                    setAllResources(reverseArray);
                    setIsLoading(false);
                })
            } catch (error) {
                console.error(error);
            }
        }   
    }, [itemsToShow, baseURL, getParams]);

    const getOneResource = async (resourceId) => {
        try {
            await axios.get(`${baseURL}/${resourceId}`)
            .then((response) => {
                setEditResourceName(response.data.name);
                setEditResourceLink(response.data.link);
                setEditResourceCategory(response.data.category);
            })
        } catch (error) {
            console.error(error);
        }
    }

    const newDate = new Date();
    const date = (newDate.toLocaleString('en-US', { hour12: true }));

    const createResource = async () => {
        if (!allResources.some(resource => resource.name === resourceName || resource.link === resourceLink)) {
            setRequestIsLoading(true);
            try {
                await axios.post(baseURL, {
                    name: resourceName,
                    link: resourceLink,
                    category: resourceCategory,
                    date: date,
                })
                .then((response) => {
                    setAllResources([response.data, ...allResources]);
                    setAddSuccessNotificationIsOpen(true);
                    setTimeout(() => {
                        setAddSuccessNotificationIsOpen(false);
                    }, 3000);
                })
                setResourceName("");
                setResourceLink("");
                setResourceCategory("");
            } catch (error) {
                console.error(error);
                setAddErrorNotificationIsOpen(true);
                setTimeout(() => {
                    setAddErrorNotificationIsOpen(false);
                }, 3000);
            }
            setRequestIsLoading(false);
        } else {
            setMatchesNotificationIsOpen(true);
            setTimeout(() => {
                setMatchesNotificationIsOpen(false);
            }, 3000);
            setResourceName("");
            setResourceLink("");
            setResourceCategory("");
        }
    }

    const openEditModal = (resourceId) => {
        getOneResource(resourceId);
        setEditModalIsOpen(true);
        setIdOfResource(resourceId)
    }

    const editResource = async (resourceId) => {
        if (!allResources.some(resource => resource.name === editResourceName || resource.link === editResourceLink)) {
            setRequestIsLoading(true);
            try {
                await axios.put(`${baseURL}/${resourceId}`, {
                    name: editResourceName,
                    link: editResourceLink,
                    category: editResourceCategory,
                    date: Date.now,
                })
                .then((response) => {
                    const indexOfChangedResource = allResources.findIndex((resource) => resource.id === response.data.id);
                    const newArray = [...allResources];
                    newArray[indexOfChangedResource] = response.data;
                    setAllResources(newArray);
                })
                setEditResourceName("");
                setEditResourceLink("");
                setEditResourceCategory("");
                setEditSuccessNotificationIsOpen(true);
                setTimeout(() => {
                    setEditSuccessNotificationIsOpen(false);
                }, 3000);
            } catch (error) {
                console.error(error);
                setEditErrorNotificationIsOpen(true);
                setTimeout(() => {
                    setEditErrorNotificationIsOpen(false);
                }, 3000);
            }
            setRequestIsLoading(false);
        } else {
            setMatchesNotificationIsOpen(true);
            setTimeout(() => {
                setMatchesNotificationIsOpen(false);
            }, 3000);
            setEditResourceName("");
            setEditResourceLink("");
            setEditResourceCategory("");
        }
        setEditModalIsOpen(false);
    }

    const openDeleteModal = (resourceId) => {
        setDeleteModalIsOpen(true);
        setIdOfResource(resourceId);
    }

    const deleteResourse = async (resourceId) => {
        setRequestIsLoading(true);
        try {
            await axios.delete(`${baseURL}/${resourceId}`)
            .then((response) => {
                const newArray = allResources.filter((resource) => resource.id !== response.data.id);
                setAllResources(newArray);
            })
            setDeleteSuccessNotificationIsOpen(true);
            setTimeout(() => {
                setDeleteSuccessNotificationIsOpen(false);
            }, 3000);
        } catch (error) {
            console.error(error);
            setDeleteErrorNotificationIsOpen(true);
            setTimeout(() => {
                setDeleteErrorNotificationIsOpen(false);
            }, 3000);
        }
        setRequestIsLoading(false);
        setDeleteModalIsOpen(false);
    }

    if (!allResources || allResources.length === 0) return (
        <div>{isLoading ? <Preloader/> : <p className='oops animate__animated animate__fadeIn'>Oops, there's nothing<br/>here yet</p>}</div>
    )

    return (
        <>
            {requestIsLoading && <Preloader/>}
            {searchInclude && 
                <div className='resources__search_wrapper animate__animated animate__fadeIn'>
                    <FontAwesomeIcon icon={faSearch} className='search-icon'/>
                    <input className='resources__search' type='text' placeholder='Search...' onChange={e => setSearchParametrs(e.currentTarget.value)}/>
                </div>
            }
            <div className={actionInfoSections ? 'action-info-wrapper' : ""}>
                {actionSection && 
                    <div className='allResources__actions_wrapper animate__animated animate__fadeIn'>
                        <div className='section__wrapper category-info-wrapper'>
                            <p className='nameOfCategory'>All resources</p>
                            <p className='countOfResources-text'>Count of resources:<span className='countOfResources'>{allResources.length}</span></p>
                        </div>
                        <div className='addResourse__wrapper section__wrapper '>
                            <div className='addResource__content_wrapper'>
                                <label className='editModal__content_label'>Name</label>
                                <input className='editModal__content_input' type="text" value={resourceName} onChange={e => setResourceName(e.target.value)}/>
                            </div>
                            <div className='addResource__content_wrapper'>
                                <label className='editModal__content_label'>Link</label>
                                <input className='editModal__content_input' type="text" value={resourceLink} onChange={e => setResourceLink(e.target.value)}/>
                            </div>
                            <div className='addResource__content_wrapper'>
                                <label className='editModal__content_label'>Category</label>
                                <input className='editModal__content_input' type="text" value={resourceCategory} onChange={e => setResourceCategory(e.target.value)}/>
                            </div>
                            <button className='libaModal__footer_button' onClick={createResource}>Create new resourse</button>
                        </div>
                    </div>
                    
                }
                <div className={fixHeight ? 'allResources__wrapper fix-height' : 'allResources__wrapper'}>
                    {
                        <ResourceWrapper dataSource={currentResources} actionSection={actionSection} openEditModal={openEditModal} openDeleteModal={openDeleteModal}/>
                    }
                    {pagination &&
                        <div className='pagination-wrapper animate__animated animate__fadeIn'>
                            <button className='prev-page' onClick={prevPage}><FontAwesomeIcon icon={faChevronLeft}/></button>
                            <Pagination resourcesPerPage={resourcesPerPage} totalCountOfResources={searchArray.length} paginate={paginate} currentPage={currentPage}/>
                            <button className='next-page' onClick={nextPage}><FontAwesomeIcon icon={faChevronRight}/></button>
                        </div>
                    }
                </div>
                {editModalIsOpen &&
                    <LibaModal modalTitle="Edit resource" closeHandler={() => setEditModalIsOpen(false)} actionHandler={() => editResource(idOfResource)} actionName="Edit">
                        <div className='addResource__content_wrapper'>
                            <label className='editModal__content_label'>Name</label>
                            <input className='editModal__content_input' type="text" value={editResourceName} onChange={e => setEditResourceName(e.target.value)}/>
                        </div>
                        <div className='addResource__content_wrapper'>
                            <label className='editModal__content_label'>Link</label>
                            <input className='editModal__content_input' type="text" value={editResourceLink} onChange={e => setEditResourceLink(e.target.value)}/>
                        </div>
                        <div className='addResource__content_wrapper'>
                            <label className='editModal__content_label'>Category</label>
                            <input className='editModal__content_input' type="text" value={editResourceCategory} onChange={e => setEditResourceCategory(e.target.value)}/>
                        </div>
                    </LibaModal>
                }
                {deleteModalIsOpen && 
                    <LibaModal modalTitle="Delete resource" closeHandler={() => setDeleteModalIsOpen(false)} actionHandler={() => deleteResourse(idOfResource)} actionName="Delete">
                        <p className='editModal__content_text'>Are you sure you want to delete the resource?</p>
                    </LibaModal>
                }
                {addSuccessNotificationIsOpen &&
                    <LibaNotification closeHandler={() => setAddSuccessNotificationIsOpen(false)}>
                        <p className='libaNotification__body_text'>Adding was success</p>
                    </LibaNotification>
                }
                {addErrorNotificationIsOpen &&
                    <LibaNotification closeHandler={() => setAddErrorNotificationIsOpen(false)}>
                        <p className='libaNotification__body_text'>Adding failed</p>
                    </LibaNotification>
                }
                {editSuccessNotificationIsOpen &&
                    <LibaNotification closeHandler={() => setEditSuccessNotificationIsOpen(false)}>
                        <p className='libaNotification__body_text'>Editing was success</p>
                    </LibaNotification>
                }
                {editErrorNotificationIsOpen &&
                    <LibaNotification closeHandler={() => setEditErrorNotificationIsOpen(false)}>
                        <p className='libaNotification__body_text'>Editing failed</p>
                    </LibaNotification>
                }
                {deleteSuccessNotificationIsOpen &&
                    <LibaNotification closeHandler={() => setDeleteSuccessNotificationIsOpen(false)}>
                        <p className='libaNotification__body_text'>Removal was success</p>
                    </LibaNotification>
                }
                {deleteErrorNotificationIsOpen &&
                    <LibaNotification closeHandler={() => setDeleteErrorNotificationIsOpen(false)}>
                        <p className='libaNotification__body_text'>Removal failed</p>
                    </LibaNotification>
                }
                {matchesNotificationIsOpen &&
                    <LibaNotification closeHandler={() => setMatchesNotificationIsOpen(false)}>
                        <p className='libaNotification__body_text'>Resource with the same name or link already exists</p>
                    </LibaNotification>
                }
            </div>
        </>
    )
};


export default CategoryComponent;