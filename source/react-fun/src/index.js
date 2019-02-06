import React from 'react';
import ReactDOM from 'react-dom'
import Draggable from 'react-draggable';
import { Line } from 'react-lineto';
import './index.css';


const rootStyle = { display: 'flex', justifyContent: 'center' };
const rowStyle = { margin: '200px 0', display: 'flex', justifyContent: 'space-between', }
const boxStyle = { padding: '10px', border: '1px solid black', };

class CustomItem extends React.Component{
	constructor(props) 
	{
		super(props);

		this.state = {
			text: "Box",
			deltaPosition: {x0: 0, y0: 0},
			parentItemPosition:{x0: 0, y0: 0},
		};
	}
	
	getDeltaPosition = () => {
		return (this.state.deltaPosition.x0.toString() + " " + this.state.deltaPosition.y0.toString());
	}
		
	onHandleDrag(e, ui){		
		const {x, y} = this.state.deltaPosition;
		const {x0, y0} = this.props.positionTracker(this.props.id, this.state.deltaPosition.x0, this.state.deltaPosition.y0);
		
		this.setState({
			text: "Box",
			deltaPosition: {
				x0: ui.x,
				y0: ui.y,
			},
			parentItemPosition:{
				x0: x0,
				y0: y0
			}
		});				
	}
	
	
	render() {		
		var sourcePosition = {
			x0: this.state.deltaPosition.x0 + 11 + 180 / 2,
			y0: this.state.deltaPosition.y0 + 61 + 180 / 2
		}
		
		var targetPosition = {
			x0: this.state.parentItemPosition.x0 + 11 + 180 / 2,
			y0: this.state.parentItemPosition.y0 + 61 + 180 / 2
		}
		
		return(				
			<div>	
			<Draggable within="draggable" start={{x: 0, y: 0}} onDrag={this.onHandleDrag.bind(this)}>			
				<div>
			
					<div>
						<ItemLine sourcePosition={sourcePosition} targetPosition={targetPosition} />
					</div>
					<div className="box">{this.getDeltaPosition()}</div>

				</div>
			</Draggable>
			</div>	     		
		);
	}	
}


class ItemLine extends React.Component{
		
	render() {		
		var lineSteps = [];
		
		var xDist = Math.abs(this.props.sourcePosition.x0 - this.props.targetPosition.x0);
		var yDist = Math.abs(this.props.sourcePosition.y0 - this.props.targetPosition.y0);
		
		
		
		if(xDist > yDist){
			lineSteps = [{
				x0: this.props.sourcePosition.x0,
				y0: this.props.sourcePosition.y0,
				x1: (this.props.sourcePosition.x0 + this.props.targetPosition.x0) / 2,
				y1: this.props.sourcePosition.y0},
			{
				x0: (this.props.sourcePosition.x0 + this.props.targetPosition.x0) / 2,
				y0: this.props.sourcePosition.y0,
				x1: (this.props.sourcePosition.x0 + this.props.targetPosition.x0) / 2,
				y1: this.props.targetPosition.y0},
			{
				x0: (this.props.sourcePosition.x0 + this.props.targetPosition.x0) / 2,
				y0: this.props.targetPosition.y0,
				x1: this.props.targetPosition.x0,
				y1: this.props.targetPosition.y0
			}]
		}
		else{
			lineSteps = [{
				x0: this.props.sourcePosition.x0,
				y0: this.props.sourcePosition.y0,
				x1: this.props.sourcePosition.x0,
				y1: (this.props.sourcePosition.y0 + this.props.targetPosition.y0) / 2},
			{
				x0: this.props.sourcePosition.x0,
				y0: (this.props.sourcePosition.y0 + this.props.targetPosition.y0) / 2,
				x1: this.props.targetPosition.x0,
				y1: (this.props.sourcePosition.y0 + this.props.targetPosition.y0) / 2},
				
			{
				x0: this.props.targetPosition.x0,
				y0: (this.props.sourcePosition.y0 + this.props.targetPosition.y0) / 2,
				x1: this.props.targetPosition.x0,
				y1: this.props.targetPosition.y0
			}]
		}
			
		return(				
			<div>				
			{lineSteps.map(
					(lineStep, index) => <Line 
			 			className="line" 
			 			borderWidth="5"
			 			key={index} 
						id={index} 
						within="draggable" 
						zIndex={-1}  
						{...lineStep}
					/>
				)}
			</div>	     		
		);
	}	
}


class App extends React.Component{
	
	constructor(props) {
		super(props);
		this.state = {
			active: null,
			boxes: [],
			positionTracker: [{
				x0: 0,
				y0: 0
			}]
		};
	}

	
	handleAddCustomItemInput = () =>{
		const newItem = [new CustomItem()];		
		this.setState(state => ({
			boxes: state.boxes.concat(newItem)
		}));
	}

	trackItemPosition = (id, x, y) =>{
		const tempArray = this.state.positionTracker
		tempArray[id] = {x0: x, y0: y}
		this.setState({
			positionTracker: tempArray
		});
		
		let outIndex = (id>0)?id-1:id;
		
		return this.state.positionTracker[outIndex]
	}

	render() {  
		
		
		
		return (
		<div className="bg">
		<button className="btn" onClick={this.handleAddCustomItemInput}>Spawn new box  
		</button>
			<div className="draggable">
				{this.state.boxes.map(
					(box, index) => <CustomItem 
						key={index} 
						id={index}
						positionTracker={this.trackItemPosition}
					/>
				)}
			</div>
		</div>			
		);
	}
};

ReactDOM.render(<App />, document.getElementById('root'));
