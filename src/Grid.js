import React, { Component } from 'react';

class Grid extends Component {
    connectedList = [];
    constructor(props) {
        super(props);
        this.state = {
            gridData: [
                [0, 0, 0, 0, 1],
                [1, 1, 0, 0, 0],
                [1, 1, 0, 1, 1],
                [0, 0, 0, 0, 0],
                [1, 1, 1, 0, 0],
            ],
            fillColor: '#4285f4',
            hoverColor: '#c6dafc',
            gridN: 5,
            curSelectedItem: { rIndex: null, cIndex: null },
            curSelectedList: [],
            curHoverList: [],
            connectedCollec: [],
        };
    }

    componentDidMount() {
    }

    squareActions(rIndex, cIndex, type) {
        if (type === "click" || type === "mouseenter") {
            let isValid = false;
            if ((type === "click" && (((this.state.curSelectedItem.rIndex !== rIndex || this.state.curSelectedItem.cIndex !== cIndex) && this.state.gridData[rIndex][cIndex] === 1) || (!this.state.curSelectedItem.rIndex && this.state.gridData[rIndex][cIndex] === 1)))
                || (type === "mouseenter" && this.state.gridData[rIndex][cIndex] === 1))
                isValid = true;
            if (isValid) {
                let selList = [];

                // Find the connected squares in the connected collection 
                if (this.state.connectedCollec.length > 0) {
                    this.state.connectedCollec.forEach((list) => {
                        let index = list.findIndex((obj) => obj.rIndex === rIndex && obj.cIndex === cIndex);
                        if (index > -1)
                            selList = [...list];
                    })
                    if (type === "click")
                        this.setState({ curSelectedList: selList, curSelectedItem: { rIndex, cIndex } });
                    else
                        this.setState({ curHoverList: selList });
                }

                // Find the connected squares by doing fresh search if it doesnot exist in the connected collection
                if (selList.length === 0) {
                    this.connectedList = [];
                    this.connectedList.push({ rIndex, cIndex });
                    for (let i = 0; i < this.connectedList.length; i++)
                        this.findConnected(this.connectedList[i].rIndex, this.connectedList[i].cIndex);
                    if (type === "click")
                        this.setState({ curSelectedList: this.connectedList, curSelectedItem: { rIndex, cIndex }, connectedCollec: [...this.state.connectedCollec, this.connectedList] });
                    else
                        this.setState({ curHoverList: this.connectedList, connectedCollec: [...this.state.connectedCollec, this.connectedList] });
                }
            }
        } else {
            if (this.state.curHoverList.length > 0)
                this.setState({ curHoverList: [] }); // On mouse leave
        }
    }

    // Find the connected squares vertically or horizontally
    findConnected(rIndex, cIndex) {
        let existIndex = -1;
        if (cIndex > 0 && this.state.gridData[rIndex][cIndex - 1] === 1) {
            existIndex = this.connectedList.findIndex((obj) => obj.rIndex === rIndex && obj.cIndex === cIndex - 1);
            (existIndex === -1) && this.connectedList.push({ rIndex: rIndex, cIndex: cIndex - 1 });
        }
        if (cIndex < (this.state.gridN - 1) && this.state.gridData[rIndex][cIndex + 1] === 1) {
            existIndex = this.connectedList.findIndex((obj) => obj.rIndex === rIndex && obj.cIndex === cIndex + 1);
            (existIndex === -1) && this.connectedList.push({ rIndex: rIndex, cIndex: cIndex + 1 });
        }
        if (rIndex > 0 && this.state.gridData[rIndex - 1][cIndex] === 1) {
            existIndex = this.connectedList.findIndex((obj) => obj.rIndex === (rIndex - 1) && obj.cIndex === cIndex);
            (existIndex === -1) && this.connectedList.push({ rIndex: rIndex - 1, cIndex: cIndex });
        }
        if (rIndex < (this.state.gridN - 1) && this.state.gridData[rIndex + 1][cIndex] === 1) {
            existIndex = this.connectedList.findIndex((obj) => obj.rIndex === (rIndex + 1) && obj.cIndex === cIndex);
            (existIndex === -1) && this.connectedList.push({ rIndex: rIndex + 1, cIndex: cIndex });
        }
    }

    sliderChange(e) {
        this.setState({ gridN: e.target.value });
    }

    fillColorChange(e) {
        this.setState({ fillColor: e.target.value });
    }

    hoverColorChange(e) {
        this.setState({ hoverColor: e.target.value });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-8 col-sm-12 col-xs-12 grid-container" style={{ gridTemplateColumns: "auto ".repeat(this.state.gridN).trim() }}>
                        {
                            this.state.gridData.slice(0, this.state.gridN).map((childArray, cIndex) =>
                                childArray.slice(0, this.state.gridN).map((obj, index) => {
                                    let hoverAffectIndex = -1, bgColor, textColor, count = 0;
                                    if (this.state.curHoverList.length > 0)
                                        hoverAffectIndex = this.state.curHoverList.findIndex((obj) => obj.rIndex === cIndex && obj.cIndex === index);
                                    bgColor = obj === 1 ? (hoverAffectIndex > -1) ? this.state.hoverColor : this.state.fillColor : "#FFF";
                                    textColor = bgColor;
                                    if (this.state.curSelectedItem.rIndex === cIndex && this.state.curSelectedItem.cIndex === index) {
                                        textColor = "#FFF";
                                        count = this.state.curSelectedList.length;
                                    }
                                    return <div className="grid-item" style={{ backgroundColor: bgColor, color: textColor }} key={(cIndex.toString() + index.toString())} onClick={this.squareActions.bind(this, cIndex, index, 'click')} onMouseEnter={this.squareActions.bind(this, cIndex, index, 'mouseenter')} onMouseLeave={this.squareActions.bind(this, cIndex, index, 'mouseleave')}>
                                        {count}
                                    </div>
                                }))
                        }
                    </div>
                    <div className="col-md-4 col-sm-12 col-xs-12">
                        <div className="row">
                            <div className="col-md-4">
                                Grid Size:
                            </div>
                            <div className="col-md-8 custom-input">
                                <input type="range" min="1" max="5" value={this.state.gridN} className="slider" id="gridSizeSlider" onChange={this.sliderChange.bind(this)} />
                                <label>{this.state.gridN} X {this.state.gridN}</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                Fill Color:
                            </div>
                            <div className="col-md-8 custom-input">
                                <input type="color" id="fillColor" className="color-picker" onChange={this.fillColorChange.bind(this)} value={this.state.fillColor}></input>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 col-sm-6 col-xs-6">
                                Hover Color:
                            </div>
                            <div className="col-md-8 col-sm-6 col-xs-6 custom-input">
                                <input type="color" id="hoverColor" className="color-picker" onChange={this.hoverColorChange.bind(this)} value={this.state.hoverColor}></input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Grid;