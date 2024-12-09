"use client";
import { useState } from "react";

function HeaderButton({ nom, action }) {

    return (
        <button className="buttonDefault" onClick={action}>
            {nom}
        </button>
    );
}
export default HeaderButton;

