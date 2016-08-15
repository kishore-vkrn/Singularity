import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { BounceRequest } from '../../actions/api/requests';

import FormModal from '../common/modal/FormModal';

class BounceModal extends Component {
  static propTypes = {
    requestId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
    bounceRequest: PropTypes.func.isRequired
  };

  show() {
    this.refs.bouceModal.show();
  }

  confirm(data) {
    const requestIds = typeof this.props.requestId === 'string' ? [this.props.requestId] : this.props.requestId;
    for (const requestId of requestIds) {
      this.props.bounceRequest(requestId, data);
    }
  }

  static INCREMENTAL_BOUNCE_VALUE = {
    INCREMENTAL: {
      label: 'Kill old tasks as new tasks become healthy',
      value: true
    },
    ALL: {
      label: 'Kill old tasks once ALL new tasks are healthy',
      value: false
    }
  };

  render() {
    const requestIds = typeof this.props.requestId === 'string' ? [this.props.requestId] : this.props.requestId;
    return (
      <FormModal
        name="Bounce Request"
        ref="bouceModal"
        action="Bounce Request"
        onConfirm={(data) => this.confirm(data)}
        buttonStyle="primary"
        formElements={[
          {
            name: 'incremental',
            type: FormModal.INPUT_TYPES.RADIO,
            values: _.values(BounceModal.INCREMENTAL_BOUNCE_VALUE),
            defaultValue: BounceModal.INCREMENTAL_BOUNCE_VALUE.INCREMENTAL.value
          },
          {
            name: 'skipHealthchecks',
            type: FormModal.INPUT_TYPES.BOOLEAN,
            label: 'Skip healthchecks during bounce'
          },
          {
            name: 'durationMillis',
            type: FormModal.INPUT_TYPES.DURATION,
            label: 'Expiration (optional)',
            help: (
              <div>
                <p>If an expiration duration is specified, this bounce will be aborted if not finished.</p>
                <p>Default value {config.defaultBounceExpirationMinutes} minutes</p>
              </div>
            )
          },
          {
            name: 'message',
            type: FormModal.INPUT_TYPES.STRING,
            label: 'Message (optional)'
          }
        ]}>
        <p>Are you sure you want to bounce {requestIds.length > 1 ? 'these' : 'this'} request{requestIds.length > 1 && 's'}?</p>
        <pre>{requestIds.join('\n')}</pre>
        <p>Bouncing a request will cause replacement tasks to be scheduled and (under normal conditions) executed immediately.</p>
      </FormModal>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  bounceRequest: (requestId, data) => dispatch(BounceRequest.trigger(requestId, data)).then(response => (ownProps.then && ownProps.then(response))),
});

export default connect(
  null,
  mapDispatchToProps,
  null,
  { withRef: true }
)(BounceModal);