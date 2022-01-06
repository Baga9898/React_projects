import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllResources = () => {
    const [allResources, setAllResources] = useState(null);

    const baseURL = "https://61c03bd033f24c00178231de.mockapi.io/resources";

    useEffect(() => {
        axios.get(baseURL).then((response) => {
        setAllResources(response.data);
        });
    }, []);

    if (!allResources || allResources.length === 0) return <p>Упс, здесь пока что ничего нет.</p>
    //TODO: Создать универсальный компонент обёртки, принимающий в пропсы children разметку с целью универсанализации окон.
    //TODO: Сделать капсом либа на фоне ресурсов в светло - сером цвете.
    return (
        // TODO: Сделать универсальный компонент.
        <div className='allResources__wrapper'>
            {
                allResources.map((resource) =>
                    <div key={resource.id} className='section__wrapper'>
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
                            <div className='section__rightside_category'>{resource.category}</div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default AllResources;