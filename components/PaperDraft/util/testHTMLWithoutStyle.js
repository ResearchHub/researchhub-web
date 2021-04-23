export const testHTMLWithoutStyle = `
<html>
    <body>
      <div class="ltx_page_main">
        <div class="ltx_page_content">
          <article class="ltx_document ltx_authors_1line">
            <h1 class="ltx_title ltx_title_document">
              Functional Protein Structure Annotation Using a Deep Convolutional
              Generative Adversarial Network
            </h1>
            <div class="ltx_authors">
              <span class="ltx_creator ltx_role_author">
                <span class="ltx_personname">
                  Ethan Moyer
                  <span
                    class="ltx_text"
                    style="position:relative; bottom:0.0pt;"
                  ><sup class="ltx_sup"><span class="ltx_text" style="font-size:80%;">1</span></sup>
                  </span>
                  <span
                    class="ltx_text"
                    style="position:relative; bottom:0.0pt;"
                  >
                    <sup class="ltx_sup">
                      <span class="ltx_text" style="font-size:80%;">
                        *
                      </span>
                    </sup>
                  </span>
                  , Jeff Winchell
                  <span
                    class="ltx_text"
                    style="position:relative; bottom:0.0pt;"
                  >
                    <sup class="ltx_sup">
                      <span class="ltx_text" style="font-size:80%;">
                        2,
                      </span>
                    </sup>
                  </span>
                  <span
                    class="ltx_text"
                    style="position:relative; bottom:0.0pt;"
                  >
                    <sup class="ltx_sup">
                      <span class="ltx_text" style="font-size:80%;">
                        4
                      </span>
                    </sup>
                  </span>
                  , Isamu Isozaki
                  <span
                    class="ltx_text"
                    style="position:relative; bottom:0.0pt;"
                  >
                    <sup class="ltx_sup">
                      <span class="ltx_text" style="font-size:80%;">
                        2
                      </span>
                    </sup>
                  </span>
                  , Yigit Alparslan
                  <span
                    class="ltx_text"
                    style="position:relative; bottom:0.0pt;"
                  >
                    <sup class="ltx_sup">
                      <span class="ltx_text" style="font-size:80%;">
                        2
                      </span>
                    </sup>
                  </span>
                  , Mali Halac
                  <span
                    class="ltx_text"
                    style="position:relative; bottom:0.0pt;"
                  >
                    <sup class="ltx_sup">
                      <span class="ltx_text" style="font-size:80%;">
                        3
                      </span>
                    </sup>
                  </span>
                  , Edward Kim
                  <span
                    class="ltx_text"
                    style="position:relative; bottom:0.0pt;"
                  >
                    <sup class="ltx_sup">
                      <span class="ltx_text" style="font-size:80%;">
                        2
                      </span>
                    </sup>
                  </span>{" "}
                </span>
                <span class="ltx_author_notes">
                  <span>
                    <span class="ltx_contact ltx_role_affiliation">
                      <span
                        class="ltx_text"
                        style="position:relative; bottom:0.0pt;"
                      >
                        <sup class="ltx_sup">
                          <span class="ltx_text" style="font-size:80%;">
                            1
                          </span>
                        </sup>
                      </span>
                      School of Biomedical Engineering, Drexel University, PA
                      <br class="ltx_break" />
                      <span
                        class="ltx_text"
                        style="position:relative; bottom:0.0pt;"
                      >
                        <sup class="ltx_sup">
                          <span class="ltx_text" style="font-size:80%;">
                            2
                          </span>
                        </sup>
                      </span>
                      College of Computing &amp; Informatics, Drexel University,
                      PA <br class="ltx_break" />
                      <span
                        class="ltx_text"
                        style="position:relative; bottom:0.0pt;"
                      >
                        <sup class="ltx_sup">
                          <span class="ltx_text" style="font-size:80%;">
                            3
                          </span>
                        </sup>
                      </span>
                      College of Engineering, Drexel University, PA
                      <br class="ltx_break" />
                      <span
                        class="ltx_text"
                        style="position:relative; bottom:0.0pt;"
                      >
                        <sup class="ltx_sup">
                          <span class="ltx_text" style="font-size:80%;">
                            4
                          </span>
                        </sup>
                      </span>
                      College of Arts &amp; Sciences, Drexel University, PA
                      <br class="ltx_break" />
                      Email: {(ejm374, jmw479, imi25, ya332, mh3636, ek826)}
                      @drexel.edu
                    </span>
                  </span>
                </span>
              </span>
            </div>

            <div class="ltx_abstract">
              <h6 class="ltx_title ltx_title_abstract">Abstract</h6>
              <p class="ltx_p">
                Identifying novel functional protein structures is at the heart of molecular engineering and molecular biology, requiring an often computationally exhaustive search. We introduce the use of a Deep Convolutional Generative Adversarial Network (DCGAN) to classify protein structures based on their functionality by encoding each sample in a grid object structure using three features in each object: the generic atom type, the position atom type, and its occupancy relative to a given atom. We train DCGAN on 3-dimensional (3D) decoy and native protein structures in order to generate and discriminate 3D protein structures. At the end of our training, loss converges to a local minimum and our DCGAN can annotate functional proteins robustly against adversarial protein samples. In the future we hope to extend the novel structures we found from the generator in our DCGAN with more samples to explore more granular functionality with varying functions. We hope that our effort will advance the field of protein structure prediction.
              </p>
            </div>
            <div class="ltx_keywords">
              Generative Adversarial Network, Protein Structure Prediction, Functional Protein Generation, Machine Learning, Bioinformatics
            </div>
            <section id="bib" class="ltx_bibliography">
              <h2 class="ltx_title ltx_title_bibliography">References</h2>

              <ul id="bib.L1" class="ltx_biblist"></ul>
            </section>
            <span class="ltx_ERROR undefined">{NoHyper}</span>
            <span id="footnote1" class="ltx_note ltx_role_footnote">
              <sup class="ltx_note_mark">†</sup>
              <span class="ltx_note_outer">
                <span class="ltx_note_content">
                  <sup class="ltx_note_mark">†</sup>
                  <span
                    class="ltx_text"
                    style="position:relative; bottom:0.0pt;"
                  >
                    <sup class="ltx_sup">
                      <span class="ltx_text" style="font-size:80%;">
                        *
                      </span>
                    </sup>
                  </span>
                  Corresponding author
                </span>
              </span>
            </span>
            <span id="footnote1a" class="ltx_note ltx_role_footnote">
              <sup class="ltx_note_mark">†</sup>
              <span class="ltx_note_outer">
                <span class="ltx_note_content">
                  <sup class="ltx_note_mark">†</sup>All source code is
                  open-sourced at
                  <a
                    href="https://github.com/drexelai/protein-nets"
                    title=""
                    class="ltx_ref ltx_href"
                    style="color:#0000FF;"
                  >
                    <span
                      class="ltx_text ltx_framed_underline"
                      style="border-color: #0000FF;"
                    >
                      GitHub.
                    </span>
                  </a>
                </span>
              </span>
            </span>
            <section id="S1" class="ltx_section">
              <h2 class="ltx_title ltx_title_section">
                <span class="ltx_tag ltx_tag_section">I </span>
                <span class="ltx_text ltx_font_smallcaps">Introduction</span>
              </h2>

              <div id="S1.p1" class="ltx_para">
                <p class="ltx_p">
                  One of the goals of metagenomics is to identify the functions of proteins present in a given sample. Two commonly used methods to determine the protein functions are 1. to compare the amino acid sequence of a protein with the functionally annotated sequences present in protein sequence databases, 2. to compare the 3-D structure of a protein against those of the protein structure databases
                  <cite class="ltx_cite ltx_citemacro_cite">
                    [
                    <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                      lietal
                    </span>
                    ]
                  </cite>
                  . Thanks to the recent advances in computational tools and techniques especially applications of machine learning in the field of metagenomics, there is a growing number of annotations of proteins available.
                </p>
              </div>
              <div id="S1.p2" class="ltx_para">
                <p class="ltx_p">
                  The inverse problem, determining the 3-D structure of a protein for a given function, is a young field which has attracted the interest of researchers as engineering of proteins with certain functions has promising applications in biotechnology and medicine
                  <cite class="ltx_cite ltx_citemacro_cite">
                    [
                    <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                      protstructpredict
                    </span>
                    ]
                  </cite>
                  . Design of such proteins may lead to novel therapeutic agents such as custom designed signaling proteins that will allow us to give specific instructions to cells
                  <cite class="ltx_cite ltx_citemacro_cite">
                    [
                    <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                      Gurevich2014
                    </span>
                    ]
                  </cite>
                  .
                </p>
              </div>
              <div id="S1.p3" class="ltx_para">
                <p class="ltx_p">
                  To address this issue, we propose an implementation of a Deep Convolutional Generative Adversarial Network using a protein data set obtained from Protein Data Bank (PDB) database.
                </p>
              </div>
              <div id="S1.p4" class="ltx_para">
                <p class="ltx_p">
                  This paper is organized such that
                  <a
                    href="#S2"
                    title="II Related Work ‣ Functional Protein Structure Annotation Using a Deep Convolutional Generative Adversarial Network"
                    class="ltx_ref ltx_refmacro_autoref"
                  >
                    <span class="ltx_text ltx_ref_tag">section II</span>
                  </a>
                  discusses related work,
                  <a
                    href="#S3"
                    title="III Methodology ‣ Functional Protein Structure Annotation Using a Deep Convolutional Generative Adversarial Network"
                    class="ltx_ref ltx_refmacro_autoref"
                  >
                    <span class="ltx_text ltx_ref_tag">section III</span>
                  </a>
                  discusses the implemented search algorithms,
                  <a
                    href="#S5"
                    title="V Experiment Results &amp; Observations ‣ Functional Protein Structure Annotation Using a Deep Convolutional Generative Adversarial Network"
                    class="ltx_ref ltx_refmacro_autoref"
                  >
                    <span class="ltx_text ltx_ref_tag">section V</span>
                  </a>
                  reports the experiments and results,
                  <a
                    href="#S4"
                    title="IV Conclusion and Future Work ‣ Functional Protein Structure Annotation Using a Deep Convolutional Generative Adversarial Network"
                    class="ltx_ref ltx_refmacro_autoref"
                  >
                    <span class="ltx_text ltx_ref_tag">section IV</span>
                  </a>
                  concludes the paper by going over the important findings and
                  discusses future work.
                </p>
              </div>
            </section>
            <section id="S2" class="ltx_section">
              <h2 class="ltx_title ltx_title_section">
                <span class="ltx_tag ltx_tag_section">Ii </span>
                <span class="ltx_text ltx_font_smallcaps">Related Work</span>
              </h2>

              <div id="S2.p1" class="ltx_para">
                <p class="ltx_p">
                  Functionality of a protein and its structure are tightly
                  coupled. Understanding the 3-D structure of a protein can give
                  us knowledge regarding its functionality.
                </p>
              </div>
              <section id="S2.SS1" class="ltx_subsection">
                <h3 class="ltx_title ltx_title_subsection">
                  <span class="ltx_tag ltx_tag_subsection">Ii-a </span>
                  <span class="ltx_text ltx_font_italic">
                    Protein Structure Prediction
                  </span>
                </h3>

                <div id="S2.SS1.p1" class="ltx_para">
                  <p class="ltx_p">
                    In the literature, we see that X-ray crystallography and
                    Nuclear Magnetic Resonance (NMR) are used to determine the
                    3-D structure of a protein
                    <cite class="ltx_cite ltx_citemacro_cite">
                      [
                      <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                        ilari2008protein
                      </span>
                      ]
                    </cite>
                    . By emitting X-ray onto protein and measuring the
                    diffractions and scatters, one can measure the density of
                    molecules in a protein. NMR technique is faster compared to
                    X-ray crystallography, but it is only used on proteins that
                    have less than 150 amino acids
                    <cite class="ltx_cite ltx_citemacro_cite">
                      [
                      <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                        goodman2000relationships
                      </span>
                      ]
                    </cite>
                    . Therefore, developing computational models that would
                    predict protein structure is a crucial need
                    <cite class="ltx_cite ltx_citemacro_cite">
                      [
                      <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                        moyer2020machine
                      </span>
                      ]
                    </cite>
                    .
                  </p>
                </div>
                <div id="S2.SS1.p2" class="ltx_para">
                  <p class="ltx_p">
                    For this reason, identifying the native three-dimensional
                    (3-D) structure of a protein is a common problem in
                    bioinformatics and has applications in drug design, protein
                    engineering, and protein annotation. Previous methods of 3-D
                    structure prediction have focused on energy minimization to
                    find thermodynamically favored structures and the results
                    are assessed in comparison to the free energy of the native
                    structure
                    <cite class="ltx_cite ltx_citemacro_cite">
                      [
                      <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                        dill2008protein
                      </span>
                      ]
                    </cite>
                    .
                  </p>
                </div>
                <div id="S2.SS1.p3" class="ltx_para">
                  <p class="ltx_p">
                    A few works in energy prediction have successfully used
                    Convolution Neural Networks (CNN) to predict the energy
                    between each of the bonds in a structure
                    <cite class="ltx_cite ltx_citemacro_cite">
                      [
                      <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                        yao2017intrinsic
                      </span>
                      ]
                    </cite>
                    . Moreover, some have attempted to quantify the relative
                    energy deviation of a decoy structure from its native, or
                    most optimally folded, structure
                    <cite class="ltx_cite ltx_citemacro_cite">
                      [
                      <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                        moyer2020measuring
                      </span>
                      ]
                    </cite>
                    . This latter method is displayed in
                    <a
                      href="#S3.F1"
                      title="Fig. 1 ‣ III Methodology ‣ Functional Protein Structure Annotation Using a Deep Convolutional Generative Adversarial Network"
                      class="ltx_ref ltx_refmacro_autoref"
                    >
                      <span class="ltx_text ltx_ref_tag">Figure 1</span>
                    </a>
                    a where the red to blue gradient corresponds to a
                    measurement of energy deviation from a decoy structure to a
                    native structure.
                  </p>
                </div>
              </section>
              <section id="S2.SS2" class="ltx_subsection">
                <h3 class="ltx_title ltx_title_subsection">
                  <span class="ltx_tag ltx_tag_subsection">Ii-B </span>
                  <span class="ltx_text ltx_font_italic">
                    Functional Protein Annotation
                  </span>
                </h3>

                <div id="S2.SS2.p1" class="ltx_para">
                  <p class="ltx_p">
                    The function of a protein is closely tied to its structure.
                    A similar sequence of amino acids between two proteins can
                    imply an identical or similar function. However there are
                    cases of even a single amino acid change entirely changing
                    the function of a protein
                    <cite class="ltx_cite ltx_citemacro_cite">
                      [
                      <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                        schaefer2012predict
                      </span>
                      ]
                    </cite>
                    . As such, additional criteria beyond protein structure is
                    needed to predict the function of a protein. To simplify
                    this task, there is a large body of work that focuses on
                    identifying ”structural motifs,” or certain protein
                    structures and amino acid sequences which are found in many
                    proteins with a specific function. It should be noted that
                    the presence of a structural motif in that protein does not
                    necessarily indicate that protein has a certain function.
                  </p>
                </div>
                <div id="S2.SS2.p2" class="ltx_para">
                  <p class="ltx_p">
                    A more general question is whether a protein is functional
                    or non-functional. Since functionality is more or less
                    indicative of native folding, one would suspect that a
                    search of functional proteins to computationally expensive.
                    To put it in perspective, the protein structure search space
                    of an
                    <span id="S2.SS2.p2.m1" class="ltx_Math">
                      <span class="mjpage">
                        <span class="mjx-chtml">
                          <span class="mjx-math" aria-label="n">
                            <span class="mjx-mrow" aria-hidden="true">
                              <span class="mjx-mi">
                                <span
                                  class="mjx-char MJXc-TeX-math-I"
                                  style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                >
                                  n
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                    -lengthed amino acid sequence has
                    <span id="S2.SS2.p2.m2" class="ltx_Math">
                      <span class="mjpage">
                        <span class="mjx-chtml">
                          <span class="mjx-math" aria-label="4^{n}">
                            <span class="mjx-mrow" aria-hidden="true">
                              <span class="mjx-msubsup">
                                <span class="mjx-base">
                                  <span class="mjx-mn">
                                    <span
                                      class="mjx-char MJXc-TeX-main-R"
                                      style="padding-top: 0.372em; padding-bottom: 0.372em;"
                                    >
                                      4
                                    </span>
                                  </span>
                                </span>
                                <span
                                  class="mjx-sup"
                                  style="font-size: 70.7%; vertical-align: 0.607em; padding-left: 0px; padding-right: 0.071em;"
                                >
                                  <span class="mjx-texatom" style="">
                                    <span class="mjx-mrow">
                                      <span class="mjx-mi">
                                        <span
                                          class="mjx-char MJXc-TeX-math-I"
                                          style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                        >
                                          n
                                        </span>
                                      </span>
                                    </span>
                                  </span>
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                    permutations. Each individual amino acid sequence may have a
                    range of unique structures in which the protein can function
                    relatively well and a select few in which it functions most
                    optimally. An exhaustive search is therefore unrealistic and
                    effort should be put into recognizing relationships between
                    functionally annotated structures that are already
                    identified using X-ray crystallography and NMR.
                  </p>
                </div>
              </section>
              <section id="S2.SS3" class="ltx_subsection">
                <h3 class="ltx_title ltx_title_subsection">
                  <span class="ltx_tag ltx_tag_subsection">Ii-C </span>
                  <span class="ltx_text ltx_font_italic">
                    Generative Adversarial Network
                  </span>
                </h3>

                <div id="S2.SS3.p1" class="ltx_para">
                  <p class="ltx_p">
                    Generative Adversarial Networks (GANs) are first introduced
                    by Ian Goodfellow and have seen wide adaptations
                    <cite class="ltx_cite ltx_citemacro_cite">
                      [
                      <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                        goodfellow2014generative
                      </span>
                      ]
                    </cite>
                    . Even though noise cancellation was the first purpose of
                    GANs, the field expanded onto developing conditional GANs
                    and has seen wide adaptations in style transfer
                    <cite class="ltx_cite ltx_citemacro_cite">
                      [
                      <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                        isola2018imagetoimage
                      </span>
                      ]
                    </cite>
                    , image generation
                    <cite class="ltx_cite ltx_citemacro_cite">
                      [
                      <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                        zhu2020unpaired
                      </span>
                      ]
                    </cite>
                    , audio generation
                    <cite class="ltx_cite ltx_citemacro_cite">
                      [
                      <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                        alparslanspeech2020
                      </span>
                      ]
                    </cite>
                    <cite class="ltx_cite ltx_citemacro_cite">
                      [
                      <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                        sparsitypaper
                      </span>
                      ]
                    </cite>
                    . <br class="ltx_break" />
                  </p>
                </div>
                <div id="S2.SS3.p2" class="ltx_para">
                  <p class="ltx_p">
                    A Generative Adversarial Network (GAN) can be thought of as
                    a zero-sum game between two networks: 1) One to discriminate
                    between real and fake data samples and 2) one to generate
                    data samples that fool this discriminator. This dynamic is
                    illistrated in
                    <a
                      href="#S3.F1"
                      title="Fig. 1 ‣ III Methodology ‣ Functional Protein Structure Annotation Using a Deep Convolutional Generative Adversarial Network"
                      class="ltx_ref ltx_refmacro_autoref"
                    >
                      <span class="ltx_text ltx_ref_tag">Figure 1</span>
                    </a>
                    d. In mathematical terms, this corresponds to the minimax
                    game:
                  </p>
                  <div class="ltx_engrafo_equation_container">
                    <table
                      id="Sx1.EGx1"
                      class="ltx_equationgroup ltx_eqn_align ltx_eqn_table"
                    >
                      <tbody id="S2.Ex1">
                        <tr class="ltx_equation ltx_eqn_row ltx_align_baseline">
                          <td class="ltx_eqn_cell ltx_eqn_center_padleft"></td>
                          <td class="ltx_td ltx_align_right ltx_eqn_cell">
                            <span id="S2.Ex1.m1" class="ltx_DisplayMath">
                              <span class="mjpage mjpage__block">
                                <span
                                  class="mjx-chtml MJXc-display"
                                  style="text-align: left;"
                                >
                                  <span
                                    class="mjx-math"
                                    aria-label=" \displaystyle\min\limits_{G}\max\limits_{D}V(D,G)= "
                                  >
                                    <span class="mjx-mrow" aria-hidden="true">
                                      <span class="mjx-mstyle">
                                        <span class="mjx-mrow">
                                          <span class="mjx-munderover">
                                            <span class="mjx-itable">
                                              <span class="mjx-row">
                                                <span class="mjx-cell">
                                                  <span class="mjx-op">
                                                    <span class="mjx-mo">
                                                      <span
                                                        class="mjx-char MJXc-TeX-main-R"
                                                        style="padding-top: 0.372em; padding-bottom: 0.372em;"
                                                      >
                                                        min
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </span>
                                              <span class="mjx-row">
                                                <span
                                                  class="mjx-under"
                                                  style="font-size: 70.7%; padding-top: 0.236em; padding-bottom: 0.141em; padding-left: 0.786em;"
                                                >
                                                  <span
                                                    class="mjx-texatom"
                                                    style=""
                                                  >
                                                    <span class="mjx-mrow">
                                                      <span class="mjx-mi">
                                                        <span
                                                          class="mjx-char MJXc-TeX-math-I"
                                                          style="padding-top: 0.519em; padding-bottom: 0.298em;"
                                                        >
                                                          G
                                                        </span>
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </span>
                                            </span>
                                          </span>
                                          <span class="mjx-munderover MJXc-space1">
                                            <span class="mjx-itable">
                                              <span class="mjx-row">
                                                <span class="mjx-cell">
                                                  <span class="mjx-op">
                                                    <span class="mjx-mo">
                                                      <span
                                                        class="mjx-char MJXc-TeX-main-R"
                                                        style="padding-top: 0.151em; padding-bottom: 0.372em;"
                                                      >
                                                        max
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </span>
                                              <span class="mjx-row">
                                                <span
                                                  class="mjx-under"
                                                  style="font-size: 70.7%; padding-top: 0.236em; padding-bottom: 0.141em; padding-left: 0.902em;"
                                                >
                                                  <span
                                                    class="mjx-texatom"
                                                    style=""
                                                  >
                                                    <span class="mjx-mrow">
                                                      <span class="mjx-mi">
                                                        <span
                                                          class="mjx-char MJXc-TeX-math-I"
                                                          style="padding-top: 0.446em; padding-bottom: 0.298em;"
                                                        >
                                                          D
                                                        </span>
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </span>
                                            </span>
                                          </span>
                                          <span class="mjx-mi MJXc-space1">
                                            <span
                                              class="mjx-char MJXc-TeX-math-I"
                                              style="padding-top: 0.446em; padding-bottom: 0.298em; padding-right: 0.186em;"
                                            >
                                              V
                                            </span>
                                          </span>
                                          <span class="mjx-mo">
                                            <span
                                              class="mjx-char MJXc-TeX-main-R"
                                              style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                            >
                                              (
                                            </span>
                                          </span>
                                          <span class="mjx-mi">
                                            <span
                                              class="mjx-char MJXc-TeX-math-I"
                                              style="padding-top: 0.446em; padding-bottom: 0.298em;"
                                            >
                                              D
                                            </span>
                                          </span>
                                          <span class="mjx-mo">
                                            <span
                                              class="mjx-char MJXc-TeX-main-R"
                                              style="margin-top: -0.144em; padding-bottom: 0.519em;"
                                            >
                                              ,
                                            </span>
                                          </span>
                                          <span class="mjx-mi MJXc-space1">
                                            <span
                                              class="mjx-char MJXc-TeX-math-I"
                                              style="padding-top: 0.519em; padding-bottom: 0.298em;"
                                            >
                                              G
                                            </span>
                                          </span>
                                          <span class="mjx-mo">
                                            <span
                                              class="mjx-char MJXc-TeX-main-R"
                                              style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                            >
                                              )
                                            </span>
                                          </span>
                                          <span class="mjx-mo MJXc-space3">
                                            <span
                                              class="mjx-char MJXc-TeX-main-R"
                                              style="padding-top: 0.077em; padding-bottom: 0.298em;"
                                            >
                                              =
                                            </span>
                                          </span>
                                        </span>
                                      </span>
                                    </span>
                                  </span>
                                </span>
                              </span>
                            </span>
                          </td>
                          <td class="ltx_td ltx_align_left ltx_eqn_cell">
                            <span id="S2.Ex1.m2" class="ltx_DisplayMath">
                              <span class="mjpage mjpage__block">
                                <span
                                  class="mjx-chtml MJXc-display"
                                  style="text-align: left;"
                                >
                                  <span
                                    class="mjx-math"
                                    aria-label=" \displaystyle\mathbb{E}_{x\sim p_{\text{data}}(x)}[\log D(x)] "
                                  >
                                    <span class="mjx-mrow" aria-hidden="true">
                                      <span class="mjx-mstyle">
                                        <span class="mjx-mrow">
                                          <span class="mjx-msubsup">
                                            <span class="mjx-base">
                                              <span class="mjx-texatom">
                                                <span class="mjx-mrow">
                                                  <span class="mjx-mi">
                                                    <span
                                                      class="mjx-char MJXc-TeX-ams-R"
                                                      style="padding-top: 0.446em; padding-bottom: 0.298em;"
                                                    >
                                                      E
                                                    </span>
                                                  </span>
                                                </span>
                                              </span>
                                            </span>
                                            <span
                                              class="mjx-sub"
                                              style="font-size: 70.7%; vertical-align: -0.275em; padding-right: 0.071em;"
                                            >
                                              <span
                                                class="mjx-texatom"
                                                style=""
                                              >
                                                <span class="mjx-mrow">
                                                  <span class="mjx-mi">
                                                    <span
                                                      class="mjx-char MJXc-TeX-math-I"
                                                      style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                                    >
                                                      x
                                                    </span>
                                                  </span>
                                                  <span class="mjx-mo">
                                                    <span
                                                      class="mjx-char MJXc-TeX-main-R"
                                                      style="padding-top: 0.077em; padding-bottom: 0.298em;"
                                                    >
                                                      ∼
                                                    </span>
                                                  </span>
                                                  <span class="mjx-msubsup">
                                                    <span class="mjx-base">
                                                      <span class="mjx-mi">
                                                        <span
                                                          class="mjx-char MJXc-TeX-math-I"
                                                          style="padding-top: 0.225em; padding-bottom: 0.446em;"
                                                        >
                                                          p
                                                        </span>
                                                      </span>
                                                    </span>
                                                    <span
                                                      class="mjx-sub"
                                                      style="font-size: 83.3%; vertical-align: -0.401em; padding-right: 0.06em;"
                                                    >
                                                      <span
                                                        class="mjx-texatom"
                                                        style=""
                                                      >
                                                        <span class="mjx-mrow">
                                                          <span class="mjx-mtext">
                                                            <span
                                                              class="mjx-char"
                                                              style="padding-top: 0.519em; padding-bottom: 0.225em;"
                                                            >
                                                              <span
                                                                class="mjx-charbox MJXc-font-inherit"
                                                                style="font-size: 100%; padding-bottom: 0.3em; width: 2em;"
                                                              >
                                                                data
                                                              </span>
                                                            </span>
                                                          </span>
                                                        </span>
                                                      </span>
                                                    </span>
                                                  </span>
                                                  <span class="mjx-mo">
                                                    <span
                                                      class="mjx-char MJXc-TeX-main-R"
                                                      style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                                    >
                                                      (
                                                    </span>
                                                  </span>
                                                  <span class="mjx-mi">
                                                    <span
                                                      class="mjx-char MJXc-TeX-math-I"
                                                      style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                                    >
                                                      x
                                                    </span>
                                                  </span>
                                                  <span class="mjx-mo">
                                                    <span
                                                      class="mjx-char MJXc-TeX-main-R"
                                                      style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                                    >
                                                      )
                                                    </span>
                                                  </span>
                                                </span>
                                              </span>
                                            </span>
                                          </span>
                                          <span class="mjx-mo">
                                            <span
                                              class="mjx-char MJXc-TeX-main-R"
                                              style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                            >
                                              [
                                            </span>
                                          </span>
                                          <span class="mjx-mi">
                                            <span
                                              class="mjx-char MJXc-TeX-main-R"
                                              style="padding-top: 0.372em; padding-bottom: 0.519em;"
                                            >
                                              log
                                            </span>
                                          </span>
                                          <span class="mjx-mo">
                                            <span class="mjx-char"></span>
                                          </span>
                                          <span class="mjx-mi MJXc-space1">
                                            <span
                                              class="mjx-char MJXc-TeX-math-I"
                                              style="padding-top: 0.446em; padding-bottom: 0.298em;"
                                            >
                                              D
                                            </span>
                                          </span>
                                          <span class="mjx-mo">
                                            <span
                                              class="mjx-char MJXc-TeX-main-R"
                                              style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                            >
                                              (
                                            </span>
                                          </span>
                                          <span class="mjx-mi">
                                            <span
                                              class="mjx-char MJXc-TeX-math-I"
                                              style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                            >
                                              x
                                            </span>
                                          </span>
                                          <span class="mjx-mo">
                                            <span
                                              class="mjx-char MJXc-TeX-main-R"
                                              style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                            >
                                              )
                                            </span>
                                          </span>
                                          <span class="mjx-mo">
                                            <span
                                              class="mjx-char MJXc-TeX-main-R"
                                              style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                            >
                                              ]
                                            </span>
                                          </span>
                                        </span>
                                      </span>
                                    </span>
                                  </span>
                                </span>
                              </span>
                            </span>
                          </td>
                          <td class="ltx_eqn_cell ltx_eqn_center_padright"></td>
                        </tr>
                      </tbody>
                      <tbody id="S2.Ex2">
                        <tr class="ltx_equation ltx_eqn_row ltx_align_baseline">
                          <td class="ltx_eqn_cell ltx_eqn_center_padleft"></td>
                          <td class="ltx_td ltx_align_right ltx_eqn_cell"></td>
                          <td class="ltx_td ltx_align_left ltx_eqn_cell">
                            <span id="S2.Ex2.m2" class="ltx_DisplayMath">
                              <span class="mjpage mjpage__block">
                                <span
                                  class="mjx-chtml MJXc-display"
                                  style="text-align: left;"
                                >
                                  <span
                                    class="mjx-math"
                                    aria-label=" \displaystyle+\mathbb{E}_{z\sim p_{z}(z)}[\log(1-D(G(z))] "
                                  >
                                    <span class="mjx-mrow" aria-hidden="true">
                                      <span class="mjx-mstyle">
                                        <span class="mjx-mrow">
                                          <span class="mjx-mo">
                                            <span
                                              class="mjx-char MJXc-TeX-main-R"
                                              style="padding-top: 0.298em; padding-bottom: 0.446em;"
                                            >
                                              +
                                            </span>
                                          </span>
                                          <span class="mjx-msubsup">
                                            <span class="mjx-base">
                                              <span class="mjx-texatom">
                                                <span class="mjx-mrow">
                                                  <span class="mjx-mi">
                                                    <span
                                                      class="mjx-char MJXc-TeX-ams-R"
                                                      style="padding-top: 0.446em; padding-bottom: 0.298em;"
                                                    >
                                                      E
                                                    </span>
                                                  </span>
                                                </span>
                                              </span>
                                            </span>
                                            <span
                                              class="mjx-sub"
                                              style="font-size: 70.7%; vertical-align: -0.275em; padding-right: 0.071em;"
                                            >
                                              <span
                                                class="mjx-texatom"
                                                style=""
                                              >
                                                <span class="mjx-mrow">
                                                  <span class="mjx-mi">
                                                    <span
                                                      class="mjx-char MJXc-TeX-math-I"
                                                      style="padding-top: 0.225em; padding-bottom: 0.298em; padding-right: 0.003em;"
                                                    >
                                                      z
                                                    </span>
                                                  </span>
                                                  <span class="mjx-mo">
                                                    <span
                                                      class="mjx-char MJXc-TeX-main-R"
                                                      style="padding-top: 0.077em; padding-bottom: 0.298em;"
                                                    >
                                                      ∼
                                                    </span>
                                                  </span>
                                                  <span class="mjx-msubsup">
                                                    <span class="mjx-base">
                                                      <span class="mjx-mi">
                                                        <span
                                                          class="mjx-char MJXc-TeX-math-I"
                                                          style="padding-top: 0.225em; padding-bottom: 0.446em;"
                                                        >
                                                          p
                                                        </span>
                                                      </span>
                                                    </span>
                                                    <span
                                                      class="mjx-sub"
                                                      style="font-size: 83.3%; vertical-align: -0.18em; padding-right: 0.06em;"
                                                    >
                                                      <span
                                                        class="mjx-texatom"
                                                        style=""
                                                      >
                                                        <span class="mjx-mrow">
                                                          <span class="mjx-mi">
                                                            <span
                                                              class="mjx-char MJXc-TeX-math-I"
                                                              style="padding-top: 0.225em; padding-bottom: 0.298em; padding-right: 0.003em;"
                                                            >
                                                              z
                                                            </span>
                                                          </span>
                                                        </span>
                                                      </span>
                                                    </span>
                                                  </span>
                                                  <span class="mjx-mo">
                                                    <span
                                                      class="mjx-char MJXc-TeX-main-R"
                                                      style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                                    >
                                                      (
                                                    </span>
                                                  </span>
                                                  <span class="mjx-mi">
                                                    <span
                                                      class="mjx-char MJXc-TeX-math-I"
                                                      style="padding-top: 0.225em; padding-bottom: 0.298em; padding-right: 0.003em;"
                                                    >
                                                      z
                                                    </span>
                                                  </span>
                                                  <span class="mjx-mo">
                                                    <span
                                                      class="mjx-char MJXc-TeX-main-R"
                                                      style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                                    >
                                                      )
                                                    </span>
                                                  </span>
                                                </span>
                                              </span>
                                            </span>
                                          </span>
                                          <span class="mjx-mo">
                                            <span
                                              class="mjx-char MJXc-TeX-main-R"
                                              style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                            >
                                              [
                                            </span>
                                          </span>
                                          <span class="mjx-mi">
                                            <span
                                              class="mjx-char MJXc-TeX-main-R"
                                              style="padding-top: 0.372em; padding-bottom: 0.519em;"
                                            >
                                              log
                                            </span>
                                          </span>
                                          <span class="mjx-mo">
                                            <span class="mjx-char"></span>
                                          </span>
                                          <span class="mjx-mo">
                                            <span
                                              class="mjx-char MJXc-TeX-main-R"
                                              style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                            >
                                              (
                                            </span>
                                          </span>
                                          <span class="mjx-mn">
                                            <span
                                              class="mjx-char MJXc-TeX-main-R"
                                              style="padding-top: 0.372em; padding-bottom: 0.372em;"
                                            >
                                              1
                                            </span>
                                          </span>
                                          <span class="mjx-mo MJXc-space2">
                                            <span
                                              class="mjx-char MJXc-TeX-main-R"
                                              style="padding-top: 0.298em; padding-bottom: 0.446em;"
                                            >
                                              −
                                            </span>
                                          </span>
                                          <span class="mjx-mi MJXc-space2">
                                            <span
                                              class="mjx-char MJXc-TeX-math-I"
                                              style="padding-top: 0.446em; padding-bottom: 0.298em;"
                                            >
                                              D
                                            </span>
                                          </span>
                                          <span class="mjx-mo">
                                            <span
                                              class="mjx-char MJXc-TeX-main-R"
                                              style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                            >
                                              (
                                            </span>
                                          </span>
                                          <span class="mjx-mi">
                                            <span
                                              class="mjx-char MJXc-TeX-math-I"
                                              style="padding-top: 0.519em; padding-bottom: 0.298em;"
                                            >
                                              G
                                            </span>
                                          </span>
                                          <span class="mjx-mo">
                                            <span
                                              class="mjx-char MJXc-TeX-main-R"
                                              style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                            >
                                              (
                                            </span>
                                          </span>
                                          <span class="mjx-mi">
                                            <span
                                              class="mjx-char MJXc-TeX-math-I"
                                              style="padding-top: 0.225em; padding-bottom: 0.298em; padding-right: 0.003em;"
                                            >
                                              z
                                            </span>
                                          </span>
                                          <span class="mjx-mo">
                                            <span
                                              class="mjx-char MJXc-TeX-main-R"
                                              style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                            >
                                              )
                                            </span>
                                          </span>
                                          <span class="mjx-mo">
                                            <span
                                              class="mjx-char MJXc-TeX-main-R"
                                              style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                            >
                                              )
                                            </span>
                                          </span>
                                          <span class="mjx-mo">
                                            <span
                                              class="mjx-char MJXc-TeX-main-R"
                                              style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                            >
                                              ]
                                            </span>
                                          </span>
                                        </span>
                                      </span>
                                    </span>
                                  </span>
                                </span>
                              </span>
                            </span>
                          </td>
                          <td class="ltx_eqn_cell ltx_eqn_center_padright"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p class="ltx_p">
                    where
                    <span id="S2.SS3.p2.m1" class="ltx_Math">
                      <span class="mjpage">
                        <span class="mjx-chtml">
                          <span class="mjx-math" aria-label="x">
                            <span class="mjx-mrow" aria-hidden="true">
                              <span class="mjx-mi">
                                <span
                                  class="mjx-char MJXc-TeX-math-I"
                                  style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                >
                                  x
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                    is a vector of real data samples,
                    <span id="S2.SS3.p2.m2" class="ltx_Math">
                      <span class="mjpage">
                        <span class="mjx-chtml">
                          <span class="mjx-math" aria-label="z">
                            <span class="mjx-mrow" aria-hidden="true">
                              <span class="mjx-mi">
                                <span
                                  class="mjx-char MJXc-TeX-math-I"
                                  style="padding-top: 0.225em; padding-bottom: 0.298em; padding-right: 0.003em;"
                                >
                                  z
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                    is a latent representation of a fake data sample,
                    <span id="S2.SS3.p2.m3" class="ltx_Math">
                      <span class="mjpage">
                        <span class="mjx-chtml">
                          <span class="mjx-math" aria-label="G">
                            <span class="mjx-mrow" aria-hidden="true">
                              <span class="mjx-mi">
                                <span
                                  class="mjx-char MJXc-TeX-math-I"
                                  style="padding-top: 0.519em; padding-bottom: 0.298em;"
                                >
                                  G
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                    is the generative network, and
                    <span id="S2.SS3.p2.m4" class="ltx_Math">
                      <span class="mjpage">
                        <span class="mjx-chtml">
                          <span class="mjx-math" aria-label="D">
                            <span class="mjx-mrow" aria-hidden="true">
                              <span class="mjx-mi">
                                <span
                                  class="mjx-char MJXc-TeX-math-I"
                                  style="padding-top: 0.446em; padding-bottom: 0.298em;"
                                >
                                  D
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                    is the discriminative network
                    <cite class="ltx_cite ltx_citemacro_cite">
                      [
                      <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                        goodfellow2014generative
                      </span>
                      ]
                    </cite>
                    . Often, the generator uses random noise in order to create
                    seemingly novel samples that are increasingly
                    indistinguishable real samples. In training both of these
                    models simultaneously, they are able to both become more
                    accurate with discrimination and generation.
                  </p>
                </div>
              </section>
              <section id="S2.SS4" class="ltx_subsection">
                <h3 class="ltx_title ltx_title_subsection">
                  <span class="ltx_tag ltx_tag_subsection">Ii-D </span>
                  <span class="ltx_text ltx_font_italic">
                    Deep Convolutional GAN (DCGAN)
                  </span>
                </h3>

                <div id="S2.SS4.p1" class="ltx_para">
                  <p class="ltx_p">DCGANs merge the areas of convolutional neural networks and the GAN architecture described in C. It extends the standard GAN architecture by replacing the fully-connected generator and discriminator networks with deep convolutional neural networks.</p>
                </div>
                <div id="S2.SS4.p2" class="ltx_para">
                  <p class="ltx_p">
                    Convolutional Neural Networks (CNNs) are useful for
                    classifying images, especially over their non-convolutional
                    counterparts because the convolution operation preserves
                    spatial properties of images by working with 2D
                    representations. In contrast, non-convolutional networks
                    require 1D representations and the image is ”flattened” (the
                    rows/columns of the image are concatenated).
                    <cite class="ltx_cite ltx_citemacro_cite">
                      [
                      <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                        DBLP:journals/corr/abs-1905-03288
                      </span>
                      ]
                    </cite>
                    and
                    <cite class="ltx_cite ltx_citemacro_cite">
                      [
                      <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                        SHARMA2018377
                      </span>
                      ]
                    </cite>
                    provide more in-depth discussions of how CNNs are used for
                    image classification/recognition.
                  </p>
                </div>
                <div id="S2.SS4.p3" class="ltx_para">
                  <p class="ltx_p">
                    The use and deployment of a GAN or DCGAN is highly dependent
                    on the problem at hand. In one case, this model could be
                    used in order to discriminate between otherwise
                    indistinguishable samples, such as . In another case, a
                    model may be deployed for the generation of unique samples.
                    Our work focuses on the latter.
                  </p>
                </div>
              </section>
            </section>
            <section id="S3" class="ltx_section">
              <h2 class="ltx_title ltx_title_section">
                <span class="ltx_tag ltx_tag_section">Iii </span>
                <span class="ltx_text ltx_font_smallcaps">Methodology</span>
              </h2>

              <figure id="S3.F1" class="ltx_figure">
                <img
                  src="figures/20210418_GAN_arch.png"
                  id="S3.F1.g1"
                  class="ltx_graphics ltx_centering"
                  width="325"
                  height="183"
                  alt="a) A measurement of deviation of energy of decoy structures relative a respective native structure. b) The features stored in each 1x1x1 angstrom object, representing the space allocated for a single atom. c) The structure of each protein encoded sample. In order to decrease the computational load of the machine learning model, these structures were trimmed down to the smallest non-zero rectangular prism. d) The Generative Adversarial Network architecture in the scope of our work."
                />
                <figcaption class="ltx_caption ltx_centering">
                  <span class="ltx_tag ltx_tag_figure">Fig. 1: </span>a) A
                  measurement of deviation of energy of decoy structures
                  relative a respective native structure. b) The features stored
                  in each 1x1x1 angstrom object, representing the space
                  allocated for a single atom. c) The structure of each protein
                  encoded sample. In order to decrease the computational load of
                  the machine learning model, these structures were trimmed down
                  to the smallest non-zero rectangular prism. d) The Generative
                  Adversarial Network architecture in the scope of our work.
                </figcaption>
              </figure>
              <section id="S3.SS1" class="ltx_subsection">
                <h3 class="ltx_title ltx_title_subsection">
                  <span class="ltx_tag ltx_tag_subsection">Iii-a </span>
                  <span class="ltx_text ltx_font_italic">Protein Data Set</span>
                </h3>

                <div id="S3.SS1.p1" class="ltx_para">
                  <p class="ltx_p">
                    In the Protein Data Bank (PDB) database, every molecular
                    structure can be uniquely identified using a four letter
                    non-case sensitive accession number, also called a PDB ID.
                    These molecular accessions are standardized in such a way
                    that the first character is numeric and the last three
                    characters are alphanumeric. An example of such a code is
                    1crn, identifying a specific hydrophobic protein structure
                    of crambin
                    <cite class="ltx_cite ltx_citemacro_cite">
                      [
                      <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                        teeter1984water
                      </span>
                      ]
                    </cite>
                    .
                  </p>
                </div>
                <div id="S3.SS1.p2" class="ltx_para">
                  <p class="ltx_p">
                    Our data set is composed of 1000 proteins segments
                    identified by PDB IDs. Each segment is exactly 11 amino
                    acids long and has more than 80% alpha helix composition.
                  </p>
                </div>
              </section>
              <section id="S3.SS2" class="ltx_subsection">
                <h3 class="ltx_title ltx_title_subsection">
                  <span class="ltx_tag ltx_tag_subsection">Iii-B </span>
                  <span class="ltx_text ltx_font_italic">
                    Protein Representation
                  </span>
                </h3>

                <div id="S3.SS2.p1" class="ltx_para">
                  <p class="ltx_p">
                    Protein structures are commonly encoded using a contact map
                    or distance matrix, which is an
                    <span id="S3.SS2.p1.m1" class="ltx_Math">
                      <span class="mjpage">
                        <span class="mjx-chtml">
                          <span class="mjx-math" aria-label="nxn">
                            <span class="mjx-mrow" aria-hidden="true">
                              <span class="mjx-mi">
                                <span
                                  class="mjx-char MJXc-TeX-math-I"
                                  style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                >
                                  n
                                </span>
                              </span>
                              <span class="mjx-mi">
                                <span
                                  class="mjx-char MJXc-TeX-math-I"
                                  style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                >
                                  x
                                </span>
                              </span>
                              <span class="mjx-mi">
                                <span
                                  class="mjx-char MJXc-TeX-math-I"
                                  style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                >
                                  n
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                    matrix of pairwise distances between
                    <span id="S3.SS2.p1.m2" class="ltx_Math">
                      <span class="mjpage">
                        <span class="mjx-chtml">
                          <span class="mjx-math" aria-label="n">
                            <span class="mjx-mrow" aria-hidden="true">
                              <span class="mjx-mi">
                                <span
                                  class="mjx-char MJXc-TeX-math-I"
                                  style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                >
                                  n
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                    atoms in a given structure
                    <cite class="ltx_cite ltx_citemacro_cite">
                      [
                      <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                        baldi2003principled
                      </span>
                      ]
                    </cite>
                    . These structures can be easily used to reconstruct a
                    protein using methods known as multidimensional scaling
                    <cite class="ltx_cite ltx_citemacro_cite">
                      [
                      <span class="ltx_ref ltx_missing_citation ltx_ref_self">
                        kruskal1964multidimensional
                      </span>
                      ]
                    </cite>
                    . Although this representation captures the distances
                    between each atom, it ignores the atom types which are
                    responsible for forming specific bonds in different levels
                    of protein structure. For instance, in alpha helix secondary
                    structures hydrogen atoms are responsible for holding the
                    helical spiral together. Additionally, sulfur atoms are
                    known to form disulfide brides in the tertiary structure of
                    a protein. Therefore, this work substitutes a contact map
                    for a convolutional network design which has known to be
                    successful in image recognition. Our hope is that
                    convolution can be used in place of contact maps as it uses
                    filter maps to learn the positional relationship amongst
                    features. In addition our use of convolution, in each atom
                    we store three additional features. These features include a
                    one-hot encoded vector for the generic atom type (carbon,
                    nitrogen, sulfur, etc), a one-hot encoded vector for the
                    positional atom type (beta-carbon, alpha-carbon, etc.), and
                    the atomic occupancy value corresponding to the nearest atom
                    given by the following formula:
                  </p>
                </div>
                <div id="S3.SS2.p2" class="ltx_para">
                  <div class="ltx_engrafo_equation_container">
                    <table id="S3.Ex3" class="ltx_equation ltx_eqn_table">
                      <tbody>
                        <tr class="ltx_equation ltx_eqn_row ltx_align_baseline">
                          <td class="ltx_eqn_cell ltx_eqn_center_padleft"></td>
                          <td class="ltx_eqn_cell ltx_align_center">
                            <span id="S3.Ex3.m1" class="ltx_DisplayMath">
                              <span class="mjpage mjpage__block">
                                <span
                                  class="mjx-chtml MJXc-display"
                                  style="text-align: left;"
                                >
                                  <span
                                    class="mjx-math"

                                    >
                                    <span class="mjx-mrow" aria-hidden="true">
                                      <span class="mjx-mi">
                                        <span
                                          class="mjx-char MJXc-TeX-math-I"
                                          style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                        >
                                          n
                                        </span>
                                      </span>
                                      <span class="mjx-mo">
                                        <span
                                          class="mjx-char MJXc-TeX-main-R"
                                          style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                        >
                                          (
                                        </span>
                                      </span>
                                      <span class="mjx-msubsup">
                                        <span class="mjx-base">
                                          <span class="mjx-mi">
                                            <span
                                              class="mjx-char MJXc-TeX-math-I"
                                              style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                            >
                                              r
                                            </span>
                                          </span>
                                        </span>
                                        <span
                                          class="mjx-sub"
                                          style="font-size: 70.7%; vertical-align: -0.212em; padding-right: 0.071em;"
                                        >
                                          <span class="mjx-texatom" style="">
                                            <span class="mjx-mrow">
                                              <span class="mjx-mi">
                                                <span
                                                  class="mjx-char MJXc-TeX-math-I"
                                                  style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                                >
                                                  a
                                                </span>
                                              </span>
                                            </span>
                                          </span>
                                        </span>
                                      </span>
                                      <span class="mjx-mo">
                                        <span
                                          class="mjx-char MJXc-TeX-main-R"
                                          style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                        >
                                          )
                                        </span>
                                      </span>
                                      <span class="mjx-mo MJXc-space3">
                                        <span
                                          class="mjx-char MJXc-TeX-main-R"
                                          style="padding-top: 0.077em; padding-bottom: 0.298em;"
                                        >
                                          =
                                        </span>
                                      </span>
                                      <span class="mjx-mn MJXc-space3">
                                        <span
                                          class="mjx-char MJXc-TeX-main-R"
                                          style="padding-top: 0.372em; padding-bottom: 0.372em;"
                                        >
                                          1
                                        </span>
                                      </span>
                                      <span class="mjx-mo MJXc-space2">
                                        <span
                                          class="mjx-char MJXc-TeX-main-R"
                                          style="padding-top: 0.298em; padding-bottom: 0.446em;"
                                        >
                                          −
                                        </span>
                                      </span>
                                      <span class="mjx-msubsup MJXc-space2">
                                        <span class="mjx-base">
                                          <span class="mjx-mi">
                                            <span
                                              class="mjx-char MJXc-TeX-math-I"
                                              style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                            >
                                              e
                                            </span>
                                          </span>
                                        </span>
                                        <span
                                          class="mjx-sup"
                                          style="font-size: 70.7%; vertical-align: 0.676em; padding-left: 0px; padding-right: 0.071em;"
                                        >
                                          <span class="mjx-texatom" style="">
                                            <span class="mjx-mrow">
                                              <span class="mjx-mo">
                                                <span
                                                  class="mjx-char MJXc-TeX-main-R"
                                                  style="padding-top: 0.298em; padding-bottom: 0.446em;"
                                                >
                                                  −
                                                </span>
                                              </span>
                                              <span class="mjx-mo">
                                                <span
                                                  class="mjx-char MJXc-TeX-main-R"
                                                  style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                                >
                                                  (
                                                </span>
                                              </span>
                                              <span class="mjx-mfrac">
                                                <span
                                                  class="mjx-box MJXc-stacked"
                                                  style="width: 2.021em; padding: 0px 0.12em;"
                                                >
                                                  <span
                                                    class="mjx-numerator"
                                                    style="font-size: 83.3%; width: 2.425em; top: -1.44em;"
                                                  >
                                                    <span
                                                      class="mjx-msubsup"
                                                      style=""
                                                    >
                                                      <span class="mjx-base">
                                                        <span class="mjx-mi">
                                                          <span
                                                            class="mjx-char MJXc-TeX-math-I"
                                                            style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                                          >
                                                            r
                                                          </span>
                                                        </span>
                                                      </span>
                                                      <span
                                                        class="mjx-sub"
                                                        style="vertical-align: -0.365em; padding-right: 0.05em;"
                                                      >
                                                        <span class="mjx-texatom">
                                                          <span class="mjx-mrow">
                                                            <span class="mjx-mi">
                                                              <span
                                                                class="mjx-char MJXc-TeX-math-I"
                                                                style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                                              >
                                                                v
                                                              </span>
                                                            </span>
                                                            <span class="mjx-mi">
                                                              <span
                                                                class="mjx-char MJXc-TeX-math-I"
                                                                style="padding-top: 0.446em; padding-bottom: 0.298em; padding-right: 0.003em;"
                                                              >
                                                                d
                                                              </span>
                                                            </span>
                                                            <span class="mjx-mi">
                                                              <span
                                                                class="mjx-char MJXc-TeX-math-I"
                                                                style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                                              >
                                                                w
                                                              </span>
                                                            </span>
                                                          </span>
                                                        </span>
                                                      </span>
                                                    </span>
                                                  </span>
                                                  <span
                                                    class="mjx-denominator"
                                                    style="font-size: 83.3%; width: 2.425em; bottom: -0.624em;"
                                                  >
                                                    <span
                                                      class="mjx-msubsup"
                                                      style=""
                                                    >
                                                      <span class="mjx-base">
                                                        <span class="mjx-mi">
                                                          <span
                                                            class="mjx-char MJXc-TeX-math-I"
                                                            style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                                          >
                                                            r
                                                          </span>
                                                        </span>
                                                      </span>
                                                      <span
                                                        class="mjx-sub"
                                                        style="vertical-align: -0.15em; padding-right: 0.05em;"
                                                      >
                                                        <span class="mjx-texatom">
                                                          <span class="mjx-mrow">
                                                            <span class="mjx-mi">
                                                              <span
                                                                class="mjx-char MJXc-TeX-math-I"
                                                                style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                                              >
                                                                a
                                                              </span>
                                                            </span>
                                                          </span>
                                                        </span>
                                                      </span>
                                                    </span>
                                                  </span>
                                                  <span
                                                    style="border-bottom: 1px solid; top: -0.296em; width: 2.021em;"
                                                    class="mjx-line"
                                                  ></span>
                                                </span>
                                                <span
                                                  style="height: 1.72em; vertical-align: -0.52em;"
                                                  class="mjx-vsize"
                                                ></span>
                                              </span>
                                              <span class="mjx-msubsup">
                                                <span class="mjx-base">
                                                  <span class="mjx-mo">
                                                    <span
                                                      class="mjx-char MJXc-TeX-main-R"
                                                      style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                                    >
                                                      )
                                                    </span>
                                                  </span>
                                                </span>
                                                <span
                                                  class="mjx-sup"
                                                  style="font-size: 83.3%; vertical-align: 0.435em; padding-left: 0px; padding-right: 0.06em;"
                                                >
                                                  <span
                                                    class="mjx-texatom"
                                                    style=""
                                                  >
                                                    <span class="mjx-mrow">
                                                      <span class="mjx-mn">
                                                        <span
                                                          class="mjx-char MJXc-TeX-main-R"
                                                          style="padding-top: 0.372em; padding-bottom: 0.372em;"
                                                        >
                                                          12
                                                        </span>
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              </span>
                                            </span>
                                          </span>
                                        </span>
                                      </span>
                                    </span>
                                  </span>
                                </span>
                              </span>
                            </span>
                          </td>
                          <td class="ltx_eqn_cell ltx_eqn_center_padright"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div id="S3.SS2.p3" class="ltx_para">
                  <p class="ltx_p">
                    where
                    <span id="S3.SS2.p3.m1" class="ltx_Math">
                      <span class="mjpage">
                        <span class="mjx-chtml">
                          <span class="mjx-math" aria-label="n(r_{a})">
                            <span class="mjx-mrow" aria-hidden="true">
                              <span class="mjx-mi">
                                <span
                                  class="mjx-char MJXc-TeX-math-I"
                                  style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                >
                                  n
                                </span>
                              </span>
                              <span class="mjx-mo">
                                <span
                                  class="mjx-char MJXc-TeX-main-R"
                                  style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                >
                                  (
                                </span>
                              </span>
                              <span class="mjx-msubsup">
                                <span class="mjx-base">
                                  <span class="mjx-mi">
                                    <span
                                      class="mjx-char MJXc-TeX-math-I"
                                      style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                    >
                                      r
                                    </span>
                                  </span>
                                </span>
                                <span
                                  class="mjx-sub"
                                  style="font-size: 70.7%; vertical-align: -0.212em; padding-right: 0.071em;"
                                >
                                  <span class="mjx-texatom" style="">
                                    <span class="mjx-mrow">
                                      <span class="mjx-mi">
                                        <span
                                          class="mjx-char MJXc-TeX-math-I"
                                          style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                        >
                                          a
                                        </span>
                                      </span>
                                    </span>
                                  </span>
                                </span>
                              </span>
                              <span class="mjx-mo">
                                <span
                                  class="mjx-char MJXc-TeX-main-R"
                                  style="padding-top: 0.446em; padding-bottom: 0.593em;"
                                >
                                  )
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                    is the single atom occupancy of atom
                    <span id="S3.SS2.p3.m2" class="ltx_Math">
                      <span class="mjpage">
                        <span class="mjx-chtml">
                          <span class="mjx-math" aria-label="a">
                            <span class="mjx-mrow" aria-hidden="true">
                              <span class="mjx-mi">
                                <span
                                  class="mjx-char MJXc-TeX-math-I"
                                  style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                >
                                  a
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                    with radius
                    <span id="S3.SS2.p3.m3" class="ltx_Math">
                      <span class="mjpage">
                        <span class="mjx-chtml">
                          <span class="mjx-math" aria-label="r_{a}">
                            <span class="mjx-mrow" aria-hidden="true">
                              <span class="mjx-msubsup">
                                <span class="mjx-base">
                                  <span class="mjx-mi">
                                    <span
                                      class="mjx-char MJXc-TeX-math-I"
                                      style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                    >
                                      r
                                    </span>
                                  </span>
                                </span>
                                <span
                                  class="mjx-sub"
                                  style="font-size: 70.7%; vertical-align: -0.212em; padding-right: 0.071em;"
                                >
                                  <span class="mjx-texatom" style="">
                                    <span class="mjx-mrow">
                                      <span class="mjx-mi">
                                        <span
                                          class="mjx-char MJXc-TeX-math-I"
                                          style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                        >
                                          a
                                        </span>
                                      </span>
                                    </span>
                                  </span>
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                    , and
                    <span id="S3.SS2.p3.m4" class="ltx_Math">
                      <span class="mjpage">
                        <span class="mjx-chtml">
                          <span class="mjx-math" aria-label="r_{vdw}">
                            <span class="mjx-mrow" aria-hidden="true">
                              <span class="mjx-msubsup">
                                <span class="mjx-base">
                                  <span class="mjx-mi">
                                    <span
                                      class="mjx-char MJXc-TeX-math-I"
                                      style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                    >
                                      r
                                    </span>
                                  </span>
                                </span>
                                <span
                                  class="mjx-sub"
                                  style="font-size: 70.7%; vertical-align: -0.219em; padding-right: 0.071em;"
                                >
                                  <span class="mjx-texatom" style="">
                                    <span class="mjx-mrow">
                                      <span class="mjx-mi">
                                        <span
                                          class="mjx-char MJXc-TeX-math-I"
                                          style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                        >
                                          v
                                        </span>
                                      </span>
                                      <span class="mjx-mi">
                                        <span
                                          class="mjx-char MJXc-TeX-math-I"
                                          style="padding-top: 0.446em; padding-bottom: 0.298em; padding-right: 0.003em;"
                                        >
                                          d
                                        </span>
                                      </span>
                                      <span class="mjx-mi">
                                        <span
                                          class="mjx-char MJXc-TeX-math-I"
                                          style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                        >
                                          w
                                        </span>
                                      </span>
                                    </span>
                                  </span>
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                    is the Van der Waals attractive force radius for atom
                    <span id="S3.SS2.p3.m5" class="ltx_Math">
                      <span class="mjpage">
                        <span class="mjx-chtml">
                          <span class="mjx-math" aria-label="a">
                            <span class="mjx-mrow" aria-hidden="true">
                              <span class="mjx-mi">
                                <span
                                  class="mjx-char MJXc-TeX-math-I"
                                  style="padding-top: 0.225em; padding-bottom: 0.298em;"
                                >
                                  a
                                </span>
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                    .
                  </p>
                </div>
                <div id="S3.SS2.p4" class="ltx_para">
                  <p class="ltx_p">
                    Each protein sample is represented with 70x70x70 Angstrom
                    (Å) grid where each 1x1x1 Å cube contains these three
                    features about a single atom in the structure as displayed
                    in
                    <a
                      href="#S3.F1"
                      title="Fig. 1 ‣ III Methodology ‣ Functional Protein Structure Annotation Using a Deep Convolutional Generative Adversarial Network"
                      class="ltx_ref ltx_refmacro_autoref"
                    >
                      <span class="ltx_text ltx_ref_tag">Figure 1</span>
                    </a>
                    b and
                    <a
                      href="#S3.F1"
                      title="Fig. 1 ‣ III Methodology ‣ Functional Protein Structure Annotation Using a Deep Convolutional Generative Adversarial Network"
                      class="ltx_ref ltx_refmacro_autoref"
                    >
                      <span class="ltx_text ltx_ref_tag">Figure 1</span>
                    </a>
                    c, respectively.
                  </p>
                </div>
              </section>
              <section id="S3.SS3" class="ltx_subsection">
                <h3 class="ltx_title ltx_title_subsection">
                  <span class="ltx_tag ltx_tag_subsection">Iii-C </span>
                  <span class="ltx_text ltx_font_italic">
                    Network Architecture &amp; Training
                  </span>
                </h3>

                <figure id="S3.T1" class="ltx_table">
                  <p class="ltx_p ltx_align_center">
                    <span class="ltx_text" style="width:173.4pt;">
                      <span class="ltx_tabular ltx_guessed_headers ltx_align_middle">
                        <span class="ltx_thead">
                          <span class="ltx_tr">
                            <span class="ltx_td ltx_align_center ltx_th ltx_th_column ltx_border_l ltx_border_r ltx_border_t">
                              <span class="ltx_text ltx_font_bold">
                                Layer type
                              </span>
                            </span>
                            <span class="ltx_td ltx_align_center ltx_th ltx_th_column ltx_border_r ltx_border_t">
                              <span class="ltx_text ltx_font_bold">
                                Output Shape
                              </span>
                            </span>
                            <span class="ltx_td ltx_align_center ltx_th ltx_th_column ltx_border_r ltx_border_t">
                              <span class="ltx_text ltx_font_bold">Param</span>#
                            </span>
                          </span>
                        </span>
                        <span class="ltx_tbody">
                          <span class="ltx_tr">
                            <span class="ltx_td ltx_align_center ltx_border_l ltx_border_r ltx_border_t">
                              Conv3D
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              (19, 13, 16, 64)
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              65728
                            </span>
                          </span>
                          <span class="ltx_tr">
                            <span class="ltx_td ltx_align_center ltx_border_l ltx_border_r ltx_border_t">
                              LeakyReLU
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              (19, 13, 16, 64)
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              0
                            </span>
                          </span>
                          <span class="ltx_tr">
                            <span class="ltx_td ltx_align_center ltx_border_l ltx_border_r ltx_border_t">
                              Conv3D
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              (10, 7, 8, 128)
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              221312
                            </span>
                          </span>
                          <span class="ltx_tr">
                            <span class="ltx_td ltx_align_center ltx_border_l ltx_border_r ltx_border_t">
                              LeakyReLU
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              (10, 7, 8, 128)
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              0
                            </span>
                          </span>
                          <span class="ltx_tr">
                            <span class="ltx_td ltx_align_center ltx_border_l ltx_border_r ltx_border_t">
                              Global Max Pooling 3D
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              (128)
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              0
                            </span>
                          </span>
                          <span class="ltx_tr">
                            <span class="ltx_td ltx_align_center ltx_border_b ltx_border_l ltx_border_r ltx_border_t">
                              Dense
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_b ltx_border_r ltx_border_t">
                              (1)
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_b ltx_border_r ltx_border_t">
                              129
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </p>
                  <figcaption class="ltx_caption ltx_centering">
                    <span class="ltx_tag ltx_tag_table">TABLE I: </span>Model
                    Architecture for discriminator. Discriminator has a total of
                    287,169 parameters, of which 287,169 is trainable and 0 is
                    non-trainable params
                  </figcaption>
                </figure>
                <figure id="S3.T2" class="ltx_table">
                  <p class="ltx_p ltx_align_center">
                    <span class="ltx_text" style="width:433.6pt;">
                      <span class="ltx_tabular ltx_guessed_headers ltx_align_middle">
                        <span class="ltx_thead">
                          <span class="ltx_tr">
                            <span class="ltx_td ltx_align_center ltx_th ltx_th_column ltx_border_l ltx_border_r ltx_border_t">
                              <span class="ltx_text ltx_font_bold">
                                Layer type
                              </span>
                            </span>
                            <span class="ltx_td ltx_align_center ltx_th ltx_th_column ltx_border_r ltx_border_t">
                              <span class="ltx_text ltx_font_bold">
                                Output Shape
                              </span>
                            </span>
                            <span class="ltx_td ltx_align_center ltx_th ltx_th_column ltx_border_r ltx_border_t">
                              <span class="ltx_text ltx_font_bold">Param</span>#
                            </span>
                          </span>
                        </span>
                        <span class="ltx_tbody">
                          <span class="ltx_tr">
                            <span class="ltx_td ltx_align_center ltx_border_l ltx_border_r ltx_border_t">
                              Dense
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              (1169792)
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              45621888
                            </span>
                          </span>
                          <span class="ltx_tr">
                            <span class="ltx_td ltx_align_center ltx_border_l ltx_border_r ltx_border_t">
                              LeakyReLU
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              (1169792)
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              0
                            </span>
                          </span>
                          <span class="ltx_tr">
                            <span class="ltx_td ltx_align_center ltx_border_l ltx_border_r ltx_border_t">
                              Reshape
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              (37, 26, 32, 38)
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              0
                            </span>
                          </span>
                          <span class="ltx_tr">
                            <span class="ltx_td ltx_align_center ltx_border_l ltx_border_r ltx_border_t">
                              Conv3DTranspose
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              (37, 26, 32, 38)
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              92454
                            </span>
                          </span>
                          <span class="ltx_tr">
                            <span class="ltx_td ltx_align_center ltx_border_l ltx_border_r ltx_border_t">
                              LeakyReLU
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              (37, 26, 32, 38)
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              0
                            </span>
                          </span>
                          <span class="ltx_tr">
                            <span class="ltx_td ltx_align_center ltx_border_l ltx_border_r ltx_border_t">
                              Conv3DTranspose
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              (37, 26, 32, 38)
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_r ltx_border_t">
                              92454
                            </span>
                          </span>
                          <span class="ltx_tr">
                            <span class="ltx_td ltx_align_center ltx_border_b ltx_border_l ltx_border_r ltx_border_t">
                              LeakyReLU
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_b ltx_border_r ltx_border_t">
                              (37, 26, 32, 38)
                            </span>
                            <span class="ltx_td ltx_align_center ltx_border_b ltx_border_r ltx_border_t">
                              495330
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </p>
                  <figcaption class="ltx_caption ltx_centering">
                    <span class="ltx_tag ltx_tag_table">TABLE II: </span>Model
                    Architecture for generator. Generator has a total of
                    46,302,126 parameters, of which 46,302,126 is trainable and
                    0 is non-trainable.
                  </figcaption>
                </figure>
                <div id="S3.SS3.p1" class="ltx_para">
                  <p class="ltx_p">
                    As it can be seen in figure
                    <a
                      href="#S4.F2"
                      title="Fig. 2 ‣ IV Conclusion and Future Work ‣ Functional Protein Structure Annotation Using a Deep Convolutional Generative Adversarial Network"
                      class="ltx_ref ltx_refmacro_autoref"
                    >
                      <span class="ltx_text ltx_ref_tag">Figure 2</span>
                    </a>
                    , we have trained our DCGAN over 50 epochs with an early
                    stopping. The training stopped on epoch around 17 and
                    resulted in a final loss of 2.962 for the generator and
                    0.642 for the discriminator. Generator has a total of
                    46,302,126 parameters, all of which are trainable.
                    Discriminator has a total of 287,169 parameters, all of
                    which is trainable. Loss in generator means that the
                    structure prediction is improving over time and the
                    discriminator is trying to discriminate between the decoy
                    and the non-decoy structure generation. Functional
                    annotation generation is robust enough against adversarial
                    attacks.
                  </p>
                </div>
              </section>
            </section>
            <section id="S4" class="ltx_section">
              <h2 class="ltx_title ltx_title_section">
                <span class="ltx_tag ltx_tag_section">Iv </span>
                <span class="ltx_text ltx_font_smallcaps">
                  Conclusion and Future Work
                </span>
              </h2>

              <figure id="S4.F2" class="ltx_figure">
                <img
                  src="figures/dcgan_horrible_20_epochs.png"
                  id="S4.F2.g1"
                  class="ltx_graphics ltx_centering"
                  width="541"
                  height="406"
                  alt="DCGAN training cycle."
                />
                <figcaption class="ltx_caption ltx_centering">
                  <span class="ltx_tag ltx_tag_figure">Fig. 2: </span>DCGAN
                  training cycle.
                </figcaption>
              </figure>
              <div id="S4.p1" class="ltx_para">
                <p class="ltx_p">
                  Two optimization steps were included in order to alleviate the
                  computational load of the DCGAN. First, the feature space was
                  trimmed from the 70x70x70 Å window down to the smallest
                  possible rectangular prism grid without removing non-zero
                  occupancy entries. Second, this grid-like formatted data was
                  fed into the DCGAN using a generator function and a batch size
                  of ten.
                </p>
              </div>
            </section>
            <section id="S5" class="ltx_section">
              <h2 class="ltx_title ltx_title_section">
                <span class="ltx_tag ltx_tag_section">V </span>
                <span class="ltx_text ltx_font_smallcaps">
                  Experiment Results &amp; Observations
                </span>
              </h2>

              <div id="S5.p1" class="ltx_para">
                <p class="ltx_p">
                  In this work, we limited our scope to simply discriminating
                  between functional and non-functional protein structures.
                  Although our results provide insight to the difficulty of the
                  problem at hand, a more focused future development would be to
                  create a DCGAN on subsets of protein structure with highly
                  specific functions, such as ligand binding and RNA
                  degradation. Furthermore, adding features such as torsion
                  (Ramachandran) angles between outer bonds of the proteins
                  would increase the representational fidelity of new generated
                  data. Such future work would allow for the possible discovery
                  of novel protein structures that are related to real samples
                  by function.
                </p>
              </div>
            </section>
            <section id="Sx1" class="ltx_section">
              <h2 class="ltx_title ltx_title_section">Acknowledgment</h2>

              <div id="Sx1.p1" class="ltx_para">
                <p class="ltx_p">
                  We would like to acknowledge Drexel Society of Artificial
                  Intelligence for its contributions and support for this
                  research.
                </p>
              </div>
            </section>
          </article>
        </div>
      </div>
    </body>
  </html>
  `;
