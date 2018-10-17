import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';

export default class CSVFormater extends Component {
  constructor(props) {
    super(props);

    this.onDrop = this.onDrop.bind(this);

    this.state = {
      file: null
    }
  }

  onDrop(files) {
    this.setState({
      file: files[0],
    }, async () => {
      this.onParse(this.state.file);
    });
  }

  async onParse(file) {
    Papa.parse(file, {
      complete: (results) => {
        let currentTransactionId = null;
        let currentObject = {};
        let resultsObject = [];
        results.data.forEach((result, i) => {
          if (result[0] !== currentTransactionId) {
            if (Object.keys(currentObject).length) {
              resultsObject.push(currentObject);
            }

            currentObject = {};
            currentTransactionId = result[0];
            currentObject.transaction_id = currentTransactionId;
          }

          currentObject[result[1]] = result[2];

          if (i % 10000 === 0 ) {
            console.log(`${i + 1} (${((i + 1) / results.data.length * 100).toFixed(2)}%)`);
          }
        });

        console.table(resultsObject);
        const csvString = Papa.unparse(resultsObject);
        console.log(csvString);
      }
    });
  }

  render() {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Dropzone onDrop={this.onDrop.bind(this)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 200, height: 200, border: 'dashed 2px #d9d9d9', borderRadius: 16, padding: 10 }}>
          <p style={{ textAlign: 'center' }}>Try dropping some files here, or click to select files to upload.</p>
        </Dropzone>
      </div>
    );
  }
}

ReactDOM.render(<CSVFormater />, app);
