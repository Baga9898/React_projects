import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import './allResources.scss'

const AllResources = ({actionSection=true}) => {
    const [allResources, setAllResources] = useState([]);

    const baseURL = "https://61c03bd033f24c00178231de.mockapi.io/resources";

    useEffect(() => {
        axios.get(baseURL).then((response) => {
        setAllResources(response.data);
        });
    }, []);

    function createResource() {
        axios.post(baseURL, {
                name: "for delete",
                category: "soft",
                link: "qwerty",
                date: Date.now,
            })
                .then((response) => {
                    setAllResources([...allResources, response.data]);
            });
        }

    function editResourse(resourceId) {
        axios.put(`${baseURL}/${resourceId}`, {
            name: "Test",
            category: "Test",
            link: "Test",
            date: Date.now,
        })
        .then((response) => {
            const indexOfChangedResource = allResources.findIndex((resource) => resource.id === response.data.id);
            const newArray = [...allResources];
            newArray[indexOfChangedResource] = response.data;
            setAllResources(newArray);
        });
    }

    function deleteResourse(resourceId) {
        axios.delete(`${baseURL}/${resourceId}`)
        .then((response) => {
            const newResourcesArray = allResources.filter((resource) => resource.id !== response.data.id);
            setAllResources(newResourcesArray);
        })
    }


    if (!allResources || allResources.length === 0) return <p>Упс, здесь пока что ничего нет.</p>
    //TODO: Создать универсальный компонент обёртки, принимающий в пропсы children разметку с целью универсанализации окон.
    //TODO: Сделать капсом либа на фоне ресурсов в светло - сером цвете.
    return (
        // TODO: Сделать универсальный компонент.
        <div className='action-info-wrapper'>
            <div className='allResources__wrapper'>
                {
                    allResources.map((resource) =>
                        <div key={resource.date} className='section__wrapper'>
                            <div className='section__leftside'>
                                <div className='section__leftside_top'>
                                    <div className='section__leftside_name'>{resource.name}</div>
                                    <div className='section__leftside_link'>{resource.link}</div>
                                </div>
                                <div className='section__leftside_down'>
                                    <div className='section__leftside_date'>{resource.date}</div>
                                </div>
                            </div>
                            <div className='section__rightside'>
                                <div className="section__rightside_top">
                                    <div className='section__rightside_category'>{resource.category}</div>
                                </div>
                                {actionSection &&
                                    <div className="section__rightside_bottom">
                                        <FontAwesomeIcon icon={faPen} className="edit-section-icon" onClick={() => editResourse(resource.id)}/>
                                        <FontAwesomeIcon icon={faTrashAlt} className="delete-section-icon" onClick={() => deleteResourse(resource.id)}/>
                                    </div>
                                }
                            </div>
                        </div>
                    )
                }
            </div>
            <div>
                {
                    actionSection && 
                    <div className='allResources__actions_wrapper'>
                        {/* TODO: Выести в отдельный компонент. */}
                        {/* <div className='countOfResources'>{allResources.length}</div> */}
                        {/* TODO: Сделать форму для создания ресурса.
                        Выести в отдельный компонент. */}
                        <div className='addResourse__wrapper section__wrapper'>
                            <button className='addResourse__button' onClick={createResource}>create new resourse</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default AllResources;