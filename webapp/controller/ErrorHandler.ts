import MessageBox from "sap/m/MessageBox";
import type ODataModel from "sap/ui/model/odata/v2/ODataModel";
import type {
  ODataModel$BatchRequestFailedEvent,
  ODataModel$BatchRequestFailedEventParameters,
  ODataModel$MetadataFailedEvent,
  ODataModel$RequestFailedEvent,
} from "sap/ui/model/odata/v2/ODataModel";
import type Component from "../Component";
import { Model$PropertyChangeEventParameters } from "sap/ui/model/Model";
import ResourceBundle from "sap/base/i18n/ResourceBundle";

// interface ParsedError {
//   message: string;
//   details?: string | object;
//   innerErrors: ODataErrorDetail[];
// }

// interface RequestFailedParameters {
//   body?: string;
//   response?: {
//     body: string;
//   };
}

// type RequestFailedResponse = RequestFailedParameters &
//   Model$PropertyChangeEventParameters &
//   ODataModel$BatchRequestFailedEventParameters;

export class ErrorHandler {
  private errors: string[] = [];
  private showError = "immediately";
  // private MessageProcessor: MessageProcessor;
  private ResourceBundle?: ResourceBundle;
  private component: Component;
  private model: ODataModel;
  private messageOpen: boolean;
  private errorText: string;
  private viewName: string;
  private isMetadataLoadedFailed: boolean | null = null;
  private EXCLUDE_EXCEPTION = ["/IWBEP/CX_MGW_BUSI_EXCEPTION", "SY/503"];

  constructor(component: Component) {
    this.component = component;
    this.messageOpen = false;

    // Model
    this.model = <ODataModel>this.component.getModel();

    // Handlers
    this.model.attachMetadataFailed(this.requestMetadataFailedHandler);
    this.model.attachRequestFailed(this.requestFailedHandler);
  }

  private requestMetadataFailedHandler = (
    event: ODataModel$MetadataFailedEvent
  ) => {
    const response = event.getParameter("response");
    this.showServiceError(response);
  };

  private requestFailedHandler = (
    event: ODataModel$BatchRequestFailedEvent & ODataModel$RequestFailedEvent
  ) => {
    const response = event.getParameter("response");
    this.showServiceError(response);
  };

  // Show a MessageBox when a service call has failed.
  // Only the first error message will be display.
  private showServiceError(details?: string | object) {
    if (this.messageOpen) {
      return;
    }

    this.messageOpen = true;

    MessageBox.error("Error", {
      details,
      // styleClass: this.component.getContentDensityClass(),
      onClose: () => {
        this.messageOpen = false;
      },
    });
  }
}
