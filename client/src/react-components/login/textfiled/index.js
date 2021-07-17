import React from "react";
import "./styles.css";

class loginTextField extends React.Component {
    render() {
        const {
            placeHolder,
            contentType,
            onChangeHandler,
            msg,
            isValid
        } = this.props;
        let textFieldClass = 'textfield';
        if (!isValid) {
            textFieldClass += '-invalid';
        }
        return (
            <div id="input-div">
                <input className={textFieldClass} 
                    type={contentType} 
                    placeholder={placeHolder} 
                    onChange={onChangeHandler}
                    />
                <div><p className='msg'>{msg}</p></div>
            </div>
        )
    }
}

export default loginTextField