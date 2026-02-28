// // import React from "react";
// // import { BrowserRouter, Routes, Route } from "react-router-dom";

// // import Login from "./components/Login";
// // import Quiz from "./components/Quiz";
// // import Result from "./components/Result";
// // import Layout from "./components/Layout";
// // import Authenticate from "./components/Authenticate";

// // const App = () => {
// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         {/* Public */}
// //         <Route path="/" element={<Login />} />

// //         {/* Protected */}
// //         <Route element={<Authenticate />}>
// //           <Route element={<Layout />}>
// //             <Route path="/quiz" element={<Quiz />} />
// //             <Route path="/result" element={<Result />} />
// //           </Route>
// //         </Route>
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // };

// // export default App;

// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Login from "./components/Login";
// import Quiz from "./components/Quiz";
// import Result from "./components/Result";
// import Layout from "./components/Layout";
// import Authenticate from "./components/Authenticate";

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public */}
//         <Route path="/" element={<Login />} />

//         {/* Protected */}
//         <Route element={<Authenticate />}>
//           <Route element={<Layout />}>
//             <Route path="/quiz" element={<Quiz />} />
//             <Route path="/result" element={<Result />} />
//           </Route>
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Quiz from "./components/Quiz";
import Result from "./components/Result";
import Layout from "./components/Layout";
import Authenticate from "./components/Authenticate";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Protected */}
        <Route element={<Authenticate />}>
          <Route element={<Layout />}>
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/result" element={<Result />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
