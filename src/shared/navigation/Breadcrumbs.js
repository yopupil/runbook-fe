import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumbs.css';

export default function Breadcrumbs (props) {
  const links = props.links || [];
  return (
    <div className='bread-crumbs'>
      {links.map((link, index) => {
        return (
          <Link
            className='bread-crumbs__link'
            key={index}
            to={link.href || '#'}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}
