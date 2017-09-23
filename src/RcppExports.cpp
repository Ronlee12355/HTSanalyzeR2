// Generated by using Rcpp::compileAttributes() -> do not edit by hand
// Generator token: 10BE3573-1514-4C36-9D1C-5A225CD40393

#include <Rcpp.h>

using namespace Rcpp;

// calcGScoreCPP
double calcGScoreCPP(IntegerVector Set, NumericVector Eso, double exponent);
RcppExport SEXP _HTSanalyzeR2_calcGScoreCPP(SEXP SetSEXP, SEXP EsoSEXP, SEXP exponentSEXP) {
BEGIN_RCPP
    Rcpp::RObject rcpp_result_gen;
    Rcpp::RNGScope rcpp_rngScope_gen;
    Rcpp::traits::input_parameter< IntegerVector >::type Set(SetSEXP);
    Rcpp::traits::input_parameter< NumericVector >::type Eso(EsoSEXP);
    Rcpp::traits::input_parameter< double >::type exponent(exponentSEXP);
    rcpp_result_gen = Rcpp::wrap(calcGScoreCPP(Set, Eso, exponent));
    return rcpp_result_gen;
END_RCPP
}

static const R_CallMethodDef CallEntries[] = {
    {"_HTSanalyzeR2_calcGScoreCPP", (DL_FUNC) &_HTSanalyzeR2_calcGScoreCPP, 3},
    {NULL, NULL, 0}
};

RcppExport void R_init_HTSanalyzeR2(DllInfo *dll) {
    R_registerRoutines(dll, NULL, CallEntries, NULL, NULL);
    R_useDynamicSymbols(dll, FALSE);
}
