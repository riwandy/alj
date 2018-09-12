import React, { Component } from 'react';
import './css/Sidebar.css';

//import components
import SidebarItem from './SidebarItem'

class Sidebar extends Component{
    render() {
        var itemList = [{caption:'Karyawan' , link:'karyawan'}, 
                        {caption:'Time Sheet' , link:'timesheet'}, 
                        {caption:'User' , link:'user'},
                        {caption:'Proyek' , link:'project'},
                        {caption:'Vendor' , link:'vendor'},
                        {caption:'Client' , link:'client'},
                        {caption:'Vehicle' , link:'vehicle'},
                        {caption:'Asset' , link:'asset'}];
        var items = itemList.map(function(item){
            return <SidebarItem menu={item.caption} key={item.caption} link={item.link}/>
        })
        return (
                <div className="sidebar">
                {items}
                </div>
        )
    }
}

export default Sidebar;