import React from 'react';
import CardMenu from './CardMenu';

export default class StudyMode extends React.Component {
 	constructor(props) {
	super(props);

	this.state = {
		show: false,
		flip: false,
		studyShow: this.props.studyShow,
		studyFlip: this.props.studyFlip,
		};
	}

	onToggleShow = () => {
		this.setState({
			show: !this.state.show
		});
	};

	onToggleFlip = () => {
		this.setState({
			flip: !this.state.flip
		});
	};

	render() {
		// get next card
		const { front, back, notes } = this.props.entry;
		const { id, onEdit, onRemove, show, flip, onNextCard } = this.props;

		return (
			<div className="sk-notification sk-base">
			{ this.state.studyFlip && (
			<div className="card-section-title">Study Flip Mode </div>
			)}
			{ this.state.studyShow && (
				<div className="card-section-title">Study Show Mode </div>
			)}
			<div className="card-entry">
				<div className="card-details">
				<div className="card-info" onClick={this.onToggleShow}>
						{ this.state.flip && (
						<div className="card-section-title">Back: </div>
						)}
						{ this.state.flip && (
						<div className="card-back">{back}<br></br><br></br></div>
						)}
						{ this.state.flip && (
						<div className="card-section-title">Front:</div>
						)}
						{ this.state.flip && this.state.show && (
						<div className="card-back">{front}<br></br><br></br></div>
						)}
						
						{ !this.state.flip && (
						<div className="card-section-title">Front:</div>
						)}
						{ !this.state.flip && (
						<div className="card-front">{front}<br></br><br></br></div>
						)}
						{ !this.state.flip && (
						<div className="card-section-title">Back: </div>
						)}
						{ !this.state.flip && this.state.show && ([
						<div className="card-back">{back}<br></br><br></br></div>
						])}
						{!this.state.show && (
						<div className="hidden-text">
								<br></br>••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• •••
								<br></br>••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• •••
								<br></br>••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• ••• •••
								<br></br>
						</div>
						)}
						{this.state.show && notes && (
						<div className="card-notes-row">
								<div className="card-section-title">Notes </div>
								<div className="card-notes">{notes}</div>
						</div>
						)}
					<div className="card-info" onClick={onNextCard}>
					{this.state.show && (
						<div className="card-menu">
							<div className="card-overlay"/>
								<div className="sk-menu-panel">
									<div className="sk-menu-panel-row">
										<div className="sk-label">Next Card</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
				</div>
				<div className="card-options">
				<CardMenu
						onFlip={this.onToggleFlip}
						onEdit={onEdit.bind(this, id)}
						onRemove={onRemove.bind(this, id)}
						/>
				</div>
		</div>
		</div>
	);
	}
}