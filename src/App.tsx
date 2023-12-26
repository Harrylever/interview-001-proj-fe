/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import './App.css';
import { getAllOptions, getCurrentRecord, postNewRecord } from './app/requests';
import { IOptions, IOptionsResponse, IRecordResponse } from '../types';
import { sortOptions } from './utils/utils';
import OptionToShow from './components/OptionToShow';

function App() {
  const [currentRecordIdState, setCurrentRecordIdState] = useState('');
  const [options, setOptions] = useState<Array<IOptions>>([]);
  const [error, setError] = useState<{
    message: string;
    status: 'error' | undefined;
  }>({ message: '', status: undefined });
  const [success, setSuccess] = useState<{ message: string; status: 'success' | undefined }>({ message: '', status: undefined });
  const [formEditState, setFormEditState] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const sectorsSelectRef = useRef<HTMLSelectElement>(null);
  const termsCheck = useRef<HTMLInputElement>(null);
  const statusContainerRef = useRef<HTMLDivElement>(null);
  const [selectedOptionsCount, setSelectedOptionsCount] = useState(0);

  //
  const getInitValues = async () => {
    const data = await getAllOptions() as IOptionsResponse;
    const sortedList = sortOptions(data.data);
    setOptions(sortedList);
  };

  //
  const changeSelectOptionsCountHandler = (list: Array<any>) => {
    let index = 0;
    for (let i = 0; i < list.length; i++) {
      index++;
    }
    setSelectedOptionsCount(index);
  };

  //
  const selectActiveOptions = ({
    name,
    values,
  }: {
    name: string;
    values: Array<{ value: string }>;
  }) => {
    nameInputRef.current!.value = name;
    termsCheck.current!.checked = true;

    values.forEach(({ value }) => {
      const option = sectorsSelectRef.current!.querySelector(
        `option[value="${value}"]`,
      ) as HTMLOptionElement;
      if (option) {
        option.selected = true;
      }
    });
    nameInputRef.current!.disabled = true;
    sectorsSelectRef.current!.disabled = true;
    termsCheck.current!.disabled = true;
    setFormEditState(true);

    // Call the changeSelectOptionsCountHandler
    changeSelectOptionsCountHandler(values);
  };

  //
  const handleGetCurrentRecord = useCallback(async (recordId: string) => {
    const data = await getCurrentRecord({ recordId }) as IRecordResponse;
    selectActiveOptions({ name: data.data.name, values: data.data.sectors });
  }, []);

  useEffect(() => {
    // Get the Sectors options from the database
    getInitValues();

    // Check if a currentRecordId is available in localstorage
    // If available fetch the record details and fill up the inputs
    const currentRecordId = window.localStorage.getItem('currentRecordId');
    if (currentRecordId !== null && currentRecordId.length > 4) {
      setCurrentRecordIdState(currentRecordId);
    }
  }, []);

  useEffect(() => {
    if (currentRecordIdState && currentRecordIdState.length > 1) {
      handleGetCurrentRecord(currentRecordIdState);
    }
  }, [currentRecordIdState]);

  //
  const handleAsyncSubmit = async ({
    name,
    sectors,
    currentRecordId,
  }: {
    name: string;
    sectors: string[];
    currentRecordId: string;
  }) => {
    try {
      // Create an empyty array to hold all the value of the different
      // selected options
      const newSectorsArray = [];

      // Loop through the array of string and create an array to hold
      // Objects of type {value: string}
      // Value being the value of the selected options
      for (let i = 0; i < sectors.length; i++) {
        newSectorsArray.push({ value: sectors[i] });
      }
      const posting = (await postNewRecord({
        name,
        sectors: newSectorsArray,
        currentRecordId,
      })) as IRecordResponse;

      // Save the document id of the newly created CURRENT RECORD to
      // local storage
      window.localStorage.setItem('currentRecordId', posting.data._id);

      // Fetch the new details and fill up the inputs
      handleGetCurrentRecord(posting.data._id);
    } catch (err) {
      console.log(err);
    }
  };

  //
  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({ message: '', status: undefined });
    setSuccess({ message: '', status: undefined });
    const nameVal = nameInputRef.current!.value;
    const seletedOptionsVal = sectorsSelectRef.current!.selectedOptions;
    const sectorsVal = Array.from(seletedOptionsVal || []).map((option) => option.value);

    if (nameVal.length < 1) {
      statusContainerRef.current!.className = 'status-container response-error';
      setError({ message: 'Enter a valid name!', status: 'error' });
      return 'Done';
    }
    if (sectorsVal.length < 1) {
      statusContainerRef.current!.className = 'status-container response-error';
      setError({ message: 'Select a Sector!', status: 'error' });
      return 'Done';
    }
    if (!termsCheck.current!.checked) {
      statusContainerRef.current!.className = 'status-container response-error';
      setError({ message: 'Check the Box!', status: 'error' });
      return 'Done';
    }

    handleAsyncSubmit({ name: nameVal, sectors: sectorsVal, currentRecordId: '' });
    statusContainerRef.current!.className = 'status-container response-success';
    setSuccess({ message: 'Record saved successfully', status: 'success' });
    return 'Done';
  };

  const closeStatus = () => {
    statusContainerRef.current!.className = '';
    setSuccess({ message: '', status: undefined });
    setError({ message: '', status: undefined });
  };

  // Enable on editing on the forms after they've contained the values
  // and are disabled
  const editForm = () => {
    nameInputRef.current!.disabled = false;
    sectorsSelectRef.current!.disabled = false;
    termsCheck.current!.disabled = false;
    setFormEditState(false);
  };

  //
  const handleSelectFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptionsVar = e.currentTarget.selectedOptions;
    const list = Array.from(selectedOptionsVar);
    changeSelectOptionsCountHandler(list);
  };

  const downloadPDF = () => {
    const pdfFilePath = '/coding challenge.pdf';

    const link = document.createElement('a');
    link.href = pdfFilePath;
    link.download = 'https://drive.google.com/file/d/1X8dA34vBrAJnBszx66hg06Avcsz3Th7K/view?usp=sharing';

    if (typeof link.download === 'string') {
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(pdfFilePath, '_blank');
    }
  };

  return (
    <section className="main-container">
      <a href="https://github.com/Harrylever/interview-001-proj-fe.git" className="repo-link-container">
        <img src="/svg/github.svg" alt="Github" className="git-icon" />
      </a>

      <div className="content-container">
        {/* Side Section 1 */}
        <div className="question-container">
          <h3>
            Please enter your name and pick the Sectors you are currently
            involved in.
          </h3>

          <div>
            <form id="content-form" onSubmit={handleOnSubmit}>
              {formEditState && (
                <div className="edit-form-btn-container">
                  <button
                    type="button"
                    className="edit-form-btn"
                    onClick={editForm}
                  >
                    <span>Edit Form</span>
                  </button>
                </div>
              )}
              <div
                id="status-container"
                className="status-container"
                ref={statusContainerRef}
              >
                {error.status !== undefined || success.status !== undefined ? (
                  <div>
                    {error.status && <p>{error.message}</p>}
                    {success.status && <p>{success.message}</p>}
                    <button type="button" onClick={closeStatus}>
                      <img
                        width="30"
                        height="30"
                        src="https://img.icons8.com/ios-glyphs/30/delete-sign.png"
                        alt="delete-sign"
                      />
                    </button>
                  </div>
                ) : null}
              </div>

              {/*  */}
              <div>
                <label className="name-field" htmlFor="name">
                  <p>Name:</p>
                  <input type="text" name="name" id="name" ref={nameInputRef} />
                </label>
              </div>

              {/*  */}
              <div>
                <label className="sectors-field" htmlFor="sectors">
                  <p>Sectors:</p>
                  <select
                    size={5}
                    multiple
                    id="sectors"
                    ref={sectorsSelectRef}
                    onChange={(e) => handleSelectFieldChange(e)}
                  >
                    {options.length > 1
                      && options.map((option) => (
                        <OptionToShow key={option.index} option={option} />
                      ))}
                  </select>
                </label>
                <p className="">
                  Select:
                  {' '}
                  <span>{selectedOptionsCount}</span>
                </p>
              </div>

              {/*  */}
              <div>
                <label className="terms-agree-field" htmlFor="terms-agree">
                  <input
                    type="checkbox"
                    name="terms-field"
                    id="terms-agree"
                    ref={termsCheck}
                  />
                  <p>Agree to terms</p>
                </label>
              </div>

              {/*  */}
              <div />

              {/*  */}
              <div>
                <button
                  type="submit"
                  disabled={formEditState}
                  className="submit-btn-field"
                  id="submit-btn"
                >
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Side Section 2 */}
        <div className="intro-plane">
          {/* Overlay */}
          <div className="overlay" />

          {/*  */}
          <div className="content-selection-container">
            <div>
              <h3>Coding Interview Question</h3>
              <p>Solve and submit within One week</p>
            </div>

            <div className="download-assignment-container">
              <button
                type="button"
                className="download-assignment-btn"
                onClick={downloadPDF}
              >
                <span>Download Assignment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
