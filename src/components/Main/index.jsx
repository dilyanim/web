import React, { useState, useEffect } from "react";
import "../Main/form.scss";
import axios from "axios";
const useValidation = (value, validations) => {
  const [isEmpty, setEmpty] = useState(true);
  const [minLengthError, setMinLengthError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [inputValid, setInputValid] = useState(false);
  useEffect(() => {
    for (const validation in validations) {
      switch (validation) {
        case "minLength":
          value.length < validations[validation]
            ? setMinLengthError(true)
            : setMinLengthError(false);
          break;
        case "isEmpty":
          value ? setEmpty(false) : setEmpty(true);
          break;
        case "isEmail":
          const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          reg.test(String(value).toLowerCase())
            ? setEmailError(false)
            : setEmailError(true);
          break;
      }
    }
  }, [value]);
  useEffect(() => {
    if (isEmpty || minLengthError ||  emailError) {
      setInputValid(false);
    } else {
      setInputValid(true);
    }
  }, [isEmpty, minLengthError, emailError]);
  return {
    isEmpty,
    minLengthError,
    emailError,
    setInputValid,
  };
};

const useInput = (initialValue, validations) => {
  const [value, setValue] = useState(initialValue);
  const [isDirty, setDirty] = useState(false);
  const valid = useValidation(value, validations);
  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = (e) => {
    setDirty(true);
  };

  return {
    value,
    onChange,
    onBlur,
    isDirty,
    ...valid,
  };
};

const Froms = () => {
  const name = useInput("", { isEmpty: true, minLength: 3 });
  const email = useInput("", { isEmpty: true, minLength: 3, isEmail: true });
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [companyValue, setCompanyValue] = useState("");
  const [projectValue, setProjectValue] = useState("");

  const handleSubmit = async () => {
    if (name.inputValid && email.inputValid) {
      try {
        const response = await axios.post("https://submit-form.com/EiTyghji", {
          UserName: name.value,
          UserEmail: email.value,
          Company: companyValue,
          Project: projectValue,
        });
        console.log("Success", response.data);
      } catch (error) {
        console.error("Error", error);
        
      }
    } else {
      console.error("Form data is invalid");
    }
  };
  return (
    <div id="form">
      <div className="container">
        <div className="form">
          <div className="form--block1">
            <div className="form--block1__input1">
              {name.isDirty && name.isEmpty && (
                <div style={{ color: "red" }}> "Это обязательная поля!" </div>
              )}
              <input
                onChange={(e) => {
                  name.onChange(e);
                  setNameValue(e.target.value);
                }}
                value={nameValue}
                onBlur={(e) => name.onBlur(e)}
                type="text"
              />
              <h1>
                YOUR NAME <span>*</span>
              </h1>
            </div>
            <div className="form--block1__input2">
              {email.isDirty && email.isEmpty && (
                <div style={{ color: "red" }}> "Это обязательная поля!" </div>
              )}
              {email.isDirty && email.emailError && (
                <div style={{ color: "red" }}> "Не корректный email!" </div>
              )}
              <input
                onChange={(e) => {
                  email.onChange(e);
                  setEmailValue(e.target.value);
                }}
                onBlur={(e) => email.onBlur(e)}
                value={emailValue}
                type="text"
              />
              <h1>
                EMAIL ADDRESS <span>*</span>
              </h1>
            </div>
            <div className="form--block1__input3">
              <input type="text"
                onChange={(e) => {
                  setCompanyValue(e.target.value);
                }}
                value={companyValue}
              />
              <h1>COMPANY NAME</h1>
            </div>
            <div className="form--block1__input4">
              <input
                onChange={(e) => {
                  setProjectValue(e.target.value);
                }}
                value={projectValue}
                type="text"
              />
              <h1>PROJECT DESCRIPTION</h1>
            </div>
          </div>
          <div className="form--services">
            <h2>WHICH SERVICES DO YOU NEED?</h2>
            <div className="form--services__btns">
              <button className="form--services__btns--btnDesign ">
                UX&UI DESING
              </button>
              <button className="form--services__btns--btnMarketing">
                SOCIAL MEDIA MARKETIMG
              </button>
            </div>
          </div>
          <div className="form--budget">
            <h4>WHAT’S YOUR BUDGET?</h4>
            <div className="form--budget__btnss">
              <button>$2,500</button>
              <button>$2,500 - $5,000</button>
              <button>$5,000 - $7,500</button>
              <button>$7,500</button>
            </div>
          </div>
          <div className="form--checkbox">
            <input type="checkbox" />
            <h3>RECEIVE MARKETING COMMUNICATIONS FROM US</h3>
          </div>
          <button
           onClick={handleSubmit}
            className="form--submit"
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Froms;

