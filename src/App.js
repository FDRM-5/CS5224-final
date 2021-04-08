// The following import structure is adhered to in all files.
// React and its ecosystem
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

// Third-party packages
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastProvider } from "react-toast-notifications";

// Local components
import ErrorBoundary from "./app/errorboundary/ErrorBoundary";
import RecipeLayout from "./app/recipe/Recipe.layout";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

const queryClient = new QueryClient();

const App = () => {
  return (
    <div css={{ display: "flex", justifyContent: "center" }} className="App">
      <div css={{ width: 1200 }}>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <ToastProvider autoDismiss autoDismissTimeout={6000}>
              <Router>
                <Switch>
                  <Route exact path="/" component={RecipeLayout} />
                </Switch>
              </Router>
            </ToastProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </div>
      <AmplifySignOut />
    </div>
  );
};

export default withAuthenticator(App);
