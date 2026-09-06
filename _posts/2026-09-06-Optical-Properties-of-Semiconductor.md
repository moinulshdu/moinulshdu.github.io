---
title: 'Optical Properties of Semiconductor'
date: 2026-09-06
permalink: /posts/2026/09/optical-properties-of-semiconductor/
tags:
  - cool posts
  - category1
  - category2
---



# What happens when a beam of light interacts with thin matter?

## Formatting conventions

Insert title, section, subsection, subsubsection, bold text, italic text, inline code, links, figures, code blocks using the following syntax:
```markdown
# Title
## Section
### Subsection
#### Subsubsection  
**Bold text**
*Italic text* 
`Inline code` 
[Link](https://example.com) 
![Figure caption](https://example.com/figure.png)
```

```python
``` python (or matlab, markdown, bash, etc.)
# Python code block
def hello_world():
    print("Hello, world!")
# do not forget to close the code block with three backticks (```)
```

Insert a table using the following syntax:
```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1, Col 1 | Row 1, Col 2 | Row 1, Col 3 |
| Row 2, Col 1 | Row 2, Col 2 | Row 2, Col 3 |
``` 

Insert a list using the following syntax:
```markdown
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2
- Item 3        
```
Insert a numbered list using the following syntax:
```markdown
1. First item
2. Second item
   1. Subitem 2.1
   2. Subitem 2.2
3. Third item
```
Insert a blockquote using the following syntax:
```markdown 
> This is a blockquote. 
```
Insert complex mathematical expressions using LaTeX syntax within dollar signs for inline math or double dollar signs for display math. For example:
```markdown
Inline math: $E=mc^2$  
Display math: 
$$
E=h\nu=h\frac{c}{\lambda_0}=\hbar\omega \tag{1}
$$
```

# DO NOT trust this piece of text yet as it is still under construction and the outline is completely taken from generative AI and have not been verified.

# Exponential Attenuation Law

<figure>
  <img src="{{ site.baseurl }}/images/science/light transmitting through a bulk semiconductor.png"
       alt="Light traversing through a bulk semiconductor">
  <figcaption>
    <strong>Figure:</strong> Light traversing through a bulk semiconductor.
  </figcaption>
</figure>

When light passes through a material, the intensity of traversed light through a bulk material with thickness of $x$ attenuates by following an exponential attenuation law:

$$ I = I_0 \cdot e^{-\alpha x} $$

Here, $I_0$ is the intensity of the incidient light, $I$ is the intensity of the attenuated light, $\alpha$ is the absorption coefficient of the material with unit of $\mathrm{cm}^{-1}$, $x$ is the thickness traversed by the light through the material. The absorption coefficient is a frequency dependent value, typically ranging from $10^3$ to $10^5$ $\mathrm{cm}^{-1}$ for bulk semiconductor. 

| Bulk Semiconductor | Absorption coefficient @ band edge |
|----|----|
| Si | $1.0\times10^5$ $\mathrm{cm}^{-1}$ @ $1.10$ $\mathrm{eV}$
| ZnS | $5.0\times10^2$ $\mathrm{cm}^{-1}$ @ $3.70$ $\mathrm{eV}$
| CdS | $5.5\times10^4$ $\mathrm{cm}^{-1}$ @ $2.50$ $\mathrm{eV}$
| CdSe | $8.0\times10^3$ $\mathrm{cm}^{-1}$ @ $1.74$ $\mathrm{eV}$
| GaAs | $8.2\times10^3$ $\mathrm{cm}^{-1}$ @ $1.43$ $\mathrm{eV}$

<!-- 
> Note to cautious redear : Material's polarizability is also denoted by $\alpha$, DO NOT confuse with absorption coefficient 
-->

> ### Derivation of absorption coefficient
> Assume that the bulk slab is cut into many thiner slabs with thickness of $\Delta x$. If each individual thinner slab absorbs a finite fraction $f$ of incident light, then the remainig portion, $1-f$, is transmitted. Now for the first sub-slab:
>
> $$I_1 = (1-f)I_0$$
>
> For the second slab:
>
> $$I_2 = (1-f)I_1 = (1-f)^2I_1$$
>
> For $m$ number of 

Beer-Lambert law defines the relationship between the absorption of light by an absorber and the properties of the material through which the light is traveling. 

$$ A = \epsilon_{\mathrm{molar}} \cdot [c] \cdot l $$

Here, $A$ is the absorbance, $\epsilon_{\mathrm{molar}}$ is the molar extinction coefficient with unit of $\mathrm{M^{-1} \, cm^{-1}}$, $[c]$ is the molar concentration of the absorbing species in $\mathrm{M}$, and $l$ is the path length of the light through the material in $\mathrm{cm}$.


## Purpose, scope, and reader promise

**One-sentence promise:** Starting with the question *“How much light comes through my sample?”*, this post builds a physically consistent path to absorption, complex refractive index, dielectric response, nanocrystal local fields, and scattering.

**Target audience:** Graduate students and researchers who measure UV-vis-NIR spectra, work with semiconductor films or nanocrystal dispersions, and want to know what each fitted or tabulated optical quantity actually means.

**Core conventions to declare before the first equation**

- Use angular frequency \(\omega=2\pi\nu\), photon energy \(E=\hbar\omega\), vacuum wavelength \(\lambda_0=c/\nu\), and vacuum wavenumber \(\tilde\nu=1/\lambda_0\).
- Use \(z\) as the direction of propagation and \(L\) as sample thickness/path length.
- Use \(\alpha\) exclusively for the **Napierian absorption coefficient** in \(\mathrm{cm^{-1}}\); do not use it for decadic absorbance or polarizability.
- Reserve \(A\) for decadic absorbance, \(T\) for transmittance, \(R\) for reflectance, \(n\) for refractive index, and \(k\) (or \(\kappa\)) for the extinction coefficient.
- State whether the sample is a bulk homogeneous film, a dilute molecular solution, a nanoparticle composite, or a turbid/scattering medium. The correct interpretation of an optical spectrum depends on this choice.
- Use SI for the main post. Put Gaussian-cgs formulas used in classic local-field papers in a clearly labeled sidebar rather than mixing unit systems.

---

## 1. The map: what happens to incident light?

### 1.1 Open with an energy-flow picture

Introduce a normally incident beam of power \(P_0\) or intensity \(I_0\). At a real sample, light can be:

- reflected at the front surface;
- transmitted through the sample;
- absorbed and converted into electronic excitation, heat, or photochemistry;
- elastically scattered into other directions;
- emitted again through photoluminescence (usually a separate, weak channel in a standard transmission experiment).

Write the measured bookkeeping relation:

$$ R+T+A_{\rm frac}+S=1, $$

where $R$, $T$, $A_{\rm frac}$, and $S$ are fractional reflectance, transmittance, absorption, and scattering loss. Explain immediately that this is not yet Beer-Lambert law.

### 1.2 Add a “same words, different quantities” table

| Quantity | Symbol | Typical unit | What it describes |
|---|---:|---:|---|
| Transmittance | \(T=I/I_0\) | dimensionless | Fraction of incident intensity detected after the sample |
| Absorbance | \(A=-\log_{10}T\) | dimensionless | Decadic logarithmic attenuation |
| Absorption coefficient | \(\alpha\) | \(\mathrm{cm^{-1}}\) | Fractional absorption rate per distance in a homogeneous medium |
| Extinction coefficient | \(k\) or \(\kappa\) | dimensionless | Imaginary part of complex refractive index |
| Molar extinction coefficient | \(\varepsilon_{\rm mol}\) | \(\mathrm{L\,mol^{-1}\,cm^{-1}}\) | Solution-phase attenuation per concentration and length |
| Absorption cross-section | \(\sigma_{\rm abs}\) | \(\mathrm{cm^2}\) | Effective absorbing area of one absorber |
| Scattering coefficient | \(\mu_s\) | \(\mathrm{cm^{-1}}\) | Scattering events per propagation distance |
| Extinction coefficient, radiative transfer | \(\mu_t\) | \(\mathrm{cm^{-1}}\) | \(\mu_a+\mu_s\); do not confuse with optical \(k\) |

**Callout:** “Extinction coefficient” is ambiguous. In semiconductor optics it often means \(k\), the imaginary refractive index. In scattering/radiative-transfer literature it often means \(\mu_t=\mu_a+\mu_s\). Use explicit symbols throughout.

---

## 2. Beer-Lambert law: the baseline attenuation model

### 2.1 Derive exponential attenuation from a thin slab

Start with a slab of thickness \(dz\). If a constant fraction of the existing light is absorbed in each infinitesimal distance,

\[
dI=-\alpha I\,dz.
\]

Separate variables and integrate from \((0,I_0)\) to \((L,I)\):

\[
\int_{I_0}^{I}\frac{dI'}{I'}=-\int_0^L\alpha\,dz,
\]

and, for uniform \(\alpha\),

\[
\boxed{I(L)=I_0e^{-\alpha L}},\qquad
\boxed{T=e^{-\alpha L}}.
\]

Explain units explicitly: \(\alpha L\) must be dimensionless; therefore \(\alpha\) is in \(\mathrm{cm^{-1}}\) if \(L\) is in cm.

### 2.2 Convert to decadic absorbance

\[
A=-\log_{10}T
=-\log_{10}\left(e^{-\alpha L}\right)
=\frac{\alpha L}{\ln10}.
\]

Thus,

\[
\boxed{\alpha=\frac{\ln10}{L}A\approx\frac{2.303A}{L}}.
\]

Use a short numerical example: a \(200\ \mathrm{nm}\) film with \(\alpha=8.0\times10^3\ \mathrm{cm^{-1}}\) has \(\alpha L=0.16\), \(T=0.852\), and \(A=0.0695\), before reflection and scattering are considered.

### 2.3 State the assumptions and failure modes

- Homogeneous material and constant \(\alpha\) across the optical path.
- Collimated detection and negligible light scattered out of, or into, the detector.
- No multiple reflections/interference, or those effects are separately corrected.
- Linear optical regime: \(\alpha\) is independent of intensity.
- No appreciable photobleaching, stimulated emission, saturation, or spatial concentration gradient.

Add a transition sentence: “Beer-Lambert law tells us the form of attenuation; the next sections explain what determines \(\alpha\).”

---

## 3. Three equivalent microscopic languages: concentration, cross-section, and absorption coefficient

### 3.1 Molecular Beer-Lambert law

Introduce the familiar solution form:

\[
A=\varepsilon_{\rm mol}cL,
\]

where \(c\) is molar concentration and \(\varepsilon_{\rm mol}\) is molar decadic extinction coefficient.

Derive its connection to \(\alpha\):

\[
\alpha=(\ln10)\varepsilon_{\rm mol}c,
\]

when \(c\) is in \(\mathrm{mol\,L^{-1}}\) and the required \(1000\ \mathrm{cm^3/L}\) conversion is included consistently. Show the fully unit-safe version:

\[
\boxed{\alpha=(\ln10)\,\varepsilon_{\rm mol}\,c\,/1000}
\]

for \(\varepsilon_{\rm mol}\,[\mathrm{L\,mol^{-1}\,cm^{-1}}]\) and \(c\,[\mathrm{mol\,L^{-1}}]\).

### 3.2 Derive absorption cross-section

Define number density \(N\) as absorbers per volume. A single absorber removes power proportional to its absorption cross-section \(\sigma_{\rm abs}\):

\[
dI=-N\sigma_{\rm abs}I\,dz.
\]

Comparison with the Beer-Lambert differential equation gives

\[
\boxed{\alpha=N\sigma_{\rm abs}}.
\]

Explain dimensions:

\[
\left[\alpha\right]=\mathrm{cm^{-1}},\quad
\left[N\right]=\mathrm{cm^{-3}},\quad
\left[\sigma_{\rm abs}\right]=\mathrm{cm^2}.
\]

### 3.3 Connect molar extinction coefficient and cross-section

Using \(N=1000N_Ac\) for \(c\) in mol/L,

\[
\boxed{\sigma_{\rm abs}=
\frac{1000\ln10}{N_A}\varepsilon_{\rm mol}}
\]

with \(\sigma_{\rm abs}\) in \(\mathrm{cm^2}\) when \(\varepsilon_{\rm mol}\) is in \(\mathrm{L\,mol^{-1}\,cm^{-1}}\).

### 3.4 Explain “intrinsic absorption coefficient” carefully

Define it in a dedicated warning box because usage varies.

- For a bulk, homogeneous semiconductor, \(\alpha_{\rm int}(E)\) means absorption produced by its intrinsic electronic transitions, excluding extrinsic scattering, reflections, substrate effects, and instrument losses.
- For a nanocrystal composite, distinguish particle-intrinsic response from measured composite attenuation. The measured \(\alpha_{\rm composite}\) includes particle volume fraction, local-field effects, and possibly scattering.
- Do not call a spectrum “intrinsic” merely because background subtraction was performed.

---

## 4. Absorption mechanisms in semiconductors

### 4.1 Start from electronic states and photon energy

Introduce valence band, conduction band, band gap \(E_g\), and photon energy \(E=hc/\lambda_0\). Add a band diagram.

### 4.2 Direct allowed transitions

Give the near-edge result for a simple 3D parabolic direct-gap semiconductor:

\[
\alpha(E)\propto\frac{\sqrt{E-E_g}}{E}
\qquad(E\ge E_g),
\]

and explain its origin step by step: Fermi’s golden rule, dipole matrix element, joint density of states, and energy conservation.

### 4.3 Indirect transitions

Explain why momentum conservation requires a phonon. Present the standard schematic forms:

\[
\alpha(E)\propto
\frac{(E-E_g+E_{\rm ph})^2}{E}
\]

for phonon absorption and

\[
\alpha(E)\propto
\frac{(E-E_g-E_{\rm ph})^2}{E}
\]

for phonon emission, with the appropriate threshold conditions and phonon occupation factors.

### 4.4 Excitonic absorption

Explain bound electron-hole pairs, the exciton binding energy \(E_B\), and the excitonic resonance just below the continuum edge:

\[
E_X\approx E_g-E_B.
\]

Introduce Lorentzian homogeneous broadening only after explaining physical sources of broadening:

\[
L(E)=\frac{1}{\pi}\frac{\Gamma/2}{(E-E_0)^2+(\Gamma/2)^2}.
\]

### 4.5 Below-gap and extrinsic absorption

Cover Urbach tails, defect states, free-carrier absorption, intervalence-band absorption, impurity transitions, and exciton-phonon coupling. Make clear that their inclusion depends on what “intrinsic” means for the particular problem.

### 4.6 “What real numbers look like” section

Use a comparison table and a log-scale plot of representative \(\alpha(E)\) values. Verify material-specific values from primary literature or authoritative optical-constant databases before publishing.

Suggested qualitative anchors:

- Below a clean band edge: \(\alpha\) may be very small, often \(<10^1\) to \(10^3\ \mathrm{cm^{-1}}\), depending strongly on defects and tails.
- Near an allowed direct transition or excitonic peak: often \(10^4\) to \(10^5\ \mathrm{cm^{-1}}\).
- Well above a strong interband transition: commonly \(10^5\) to \(10^6\ \mathrm{cm^{-1}}\).

Include a caution that these are orders of magnitude, not universal semiconductor constants.

---

## 5. From Maxwell’s equations to the complex refractive index

### 5.1 Introduce the complex dielectric function

For a linear isotropic medium, write

\[
\mathbf D(\omega)=\epsilon_0\epsilon_r(\omega)\mathbf E(\omega),
\]

with

\[
\boxed{\epsilon_r(\omega)=\epsilon_1(\omega)+i\epsilon_2(\omega)}.
\]

Clarify the names:

- \(\epsilon_1\): dispersive, energy-storing part of the response;
- \(\epsilon_2\): dissipative/absorptive part, provided the sign convention is \(e^{-i\omega t}\).

### 5.2 What dielectric constant means physically

Build the explanation in three layers:

1. **Static field:** polarization of matter reduces the electric field produced by free charge; \(\epsilon_r\) compares the material response with vacuum.
2. **Optical field:** bound charges cannot follow arbitrarily fast; therefore \(\epsilon_r\) depends on frequency.
3. **Complex response:** a phase lag between polarization and field transfers energy from the electromagnetic wave to the material; this appears as \(\epsilon_2>0\).

Introduce polarization and susceptibility:

\[
\mathbf P=\epsilon_0\chi_e\mathbf E,
\qquad
\epsilon_r=1+\chi_e.
\]

### 5.3 Derive the complex index relation

Define

\[
\tilde n=n+i\kappa,
\]

and, for a nonmagnetic material \((\mu_r\approx1)\),

\[
\boxed{\tilde n^2=\epsilon_r}.
\]

Equate real and imaginary parts:

\[
\epsilon_1=n^2-\kappa^2,
\qquad
\epsilon_2=2n\kappa.
\]

Then derive

\[
n=\left[\frac{\sqrt{\epsilon_1^2+\epsilon_2^2}+\epsilon_1}{2}\right]^{1/2},
\]

\[
\kappa=\left[\frac{\sqrt{\epsilon_1^2+\epsilon_2^2}-\epsilon_1}{2}\right]^{1/2}.
\]

### 5.4 Derive attenuation from a complex wavevector

Start with the field,

\[
E(z,t)=E_0e^{i(\tilde nk_0z-\omega t)},
\qquad k_0=\frac{\omega}{c}.
\]

Show that

\[
E(z,t)=E_0e^{-k_0\kappa z}e^{i(nk_0z-\omega t)}.
\]

Because intensity is proportional to \(|E|^2\),

\[
I(z)=I_0e^{-2k_0\kappa z}.
\]

Therefore,

\[
\boxed{\alpha=2k_0\kappa
=\frac{2\omega\kappa}{c}
=\frac{4\pi\kappa}{\lambda_0}}.
\]

This is the central bridge between spectroscopic absorption coefficient and optical constants.

### 5.5 Connect \(\alpha\), \(n\), \(\kappa\), and \(\epsilon_2\)

From \(\epsilon_2=2n\kappa\), obtain

\[
\boxed{\alpha=\frac{\omega\epsilon_2}{nc}}
\]

for a homogeneous nonmagnetic bulk medium. Explain the useful weak-absorption approximation \(\kappa\ll n\):

\[
n\approx\sqrt{\epsilon_1},
\qquad
\kappa\approx\frac{\epsilon_2}{2n}.
\]

**Important boundary:** This \(\alpha\) is the intrinsic propagation loss of a homogeneous medium. It is not automatically the attenuation coefficient measured through a rough film, a nanoparticle dispersion, or a multilayer stack.

---

## 6. Reflection, interfaces, and why transmission is not automatically absorption

### 6.1 Fresnel reflection at normal incidence

For an interface from medium 1 to a complex-index medium 2,

\[
r=\frac{\tilde n_1-\tilde n_2}{\tilde n_1+\tilde n_2},
\qquad
R=|r|^2.
\]

Explain that high refractive index can give substantial reflection even where absorption is weak.

### 6.2 Thin absorbing slab without coherent interference

Use the single-pass approximation:

\[
T\approx(1-R)^2e^{-\alpha L}.
\]

Then state when it is inadequate: thin coherent films, polished substrates, Fabry-Perot fringes, roughness, and strong multiple reflections. Link to transfer-matrix methods as an advanced follow-up rather than deriving the full formalism in the main narrative.

### 6.3 Suggested practical box: extracting \(\alpha\) from data

- If \(R\) is negligible and scattering is negligible, use \(\alpha=-\ln T/L\).
- If \(R\) is known and interference is negligible, use \(\alpha=-\ln[T/(1-R)^2]/L\) as a first approximation.
- If the film is thin/coherent, fit \(n(\lambda)\), \(k(\lambda)\), thickness, and roughness jointly with a transfer-matrix model or use ellipsometry.
- If scattering is appreciable, measure integrating-sphere transmittance and reflectance before interpreting attenuation as absorption.

---

## 7. Local-field effects: from a dielectric sphere to a semiconductor nanocrystal

### 7.1 Explain why the bulk relation is insufficient for a nanoparticle composite

Set up the distinction:

- **Bulk semiconductor:** the optical wave propagates through a continuous material; \(\alpha=4\pi\kappa/\lambda_0\) applies directly.
- **Nanocrystals in a matrix:** the field applied to the composite is not the field inside each particle. The particle has a distinct dielectric function and an interface with the host.

### 7.2 Derive the local-field factor for a dielectric sphere

Assume a sphere of dielectric function \(\epsilon_p\), radius \(a\), in a host of dielectric constant \(\epsilon_m\), under a uniform applied field \(\mathbf E_0\). State the quasistatic condition:

\[
x=\frac{2\pi n_m(2a)}{\lambda_0}\ll1.
\]

Outline the derivation by solving Laplace’s equation:

\[
\nabla^2\Phi=0
\]

inside and outside the sphere, applying continuity of \(\Phi\) and of normal displacement \(\epsilon\partial\Phi/\partial r\) at \(r=a\). Then present the result:

\[
\boxed{
\mathbf E_{\rm in}
=f\mathbf E_0,
\qquad
f(\omega)=\frac{3\epsilon_m}{\epsilon_p(\omega)+2\epsilon_m}
}.
\]

### 7.3 Interpret the result physically

- The applied field polarizes both the particle and the host.
- Bound charge appears at the interface because their polarizations differ.
- The field produced by this surface charge adds to or opposes the applied field inside the particle.
- If \(\mathrm{Re}[\epsilon_p]>\epsilon_m\), the depolarization field often reduces the internal field: \(|f|<1\).
- For a metal near \(\mathrm{Re}[\epsilon_p]\approx-2\epsilon_m\), \(|f|\) can be large: localized surface-plasmon enhancement.

### 7.4 Derive particle polarizability and connect it to absorption

Present the quasistatic polarizability in SI:

\[
\boxed{
\alpha_{\rm pol}=4\pi\epsilon_0\epsilon_m a^3
\frac{\epsilon_p-\epsilon_m}{\epsilon_p+2\epsilon_m}
}.
\]

Carefully distinguish \(\alpha_{\rm pol}\) (polarizability) from \(\alpha\) (absorption coefficient).

Explain that the imaginary part of particle polarizability describes power removed from the incident wave, while the division between absorption and scattering depends on particle size.

### 7.5 Local field and absorption in a dilute composite

Introduce the qualitative form:

\[
\alpha_{\rm composite}(\omega)
\propto p\,|f(\omega)|^2\,\epsilon_{p,2}(\omega),
\]

where \(p\) is particle volume fraction and \(\epsilon_{p,2}\) is the imaginary part of the particle dielectric function.

Then explain the three separate effects:

1. \(p\): fewer particles per volume means less total absorption.
2. \(\epsilon_{p,2}\): intrinsic electronic dissipation inside CdSe.
3. \(|f|^2\): actual internal intensity is \(|f|^2\) times the external intensity.

Include a worked CdSe-in-glass estimate using \(\epsilon_{\infty,\rm CdSe}\approx6.1\), \(\epsilon_m\approx2.25\):

\[
f\approx\frac{3(2.25)}{6.1+2(2.25)}\approx0.64,
\qquad |f|^2\approx0.41.
\]

State explicitly that the exact values are frequency dependent near an excitonic resonance.

### 7.6 Advanced caveat: resonant and nonlocal local fields

Explain, without burying the main story:

- Near a discrete excitonic resonance, \(\epsilon_p(\omega)\) and therefore \(f(\omega)\) are complex and frequency dependent.
- A purely local dielectric model can double-count a resonant electron’s own reaction field; this is the self-reaction issue discussed in Ricard *et al.*
- The simple sphere formula is a useful first model, not a substitute for a full quantum or nonlocal calculation when the resonance is very narrow or particle dimensions approach the wavelength.

---

## 8. Scattering: attenuation without absorption

### 8.1 Introduce scattering coefficients and the radiative-transfer form

Define

\[
\mu_t=\mu_a+\mu_s,
\]

and, for ballistic/collimated transmission,

\[
I_{\
m ballistic}(z)=I_0e^{-\mu_tz}.
\]

Explain that \(\mu_a\) is absorption coefficient, \(\mu_s\) is scattering coefficient, and \(\mu_t\) is total extinction/attenuation coefficient. All have units \(\mathrm{cm^{-1}}\).

Then emphasize: a conventional UV-vis detector may interpret light scattered outside its collection angle as “absorbance,” even when the lost light was not absorbed.

### 8.2 Rayleigh scattering: particles much smaller than the wavelength

State the regime:

\[
x=\frac{2\pi n_m a}{\lambda_0}\ll1.
\]

Define relative refractive index:

\[
m=\frac{\tilde n_p}{\tilde n_m}.
\]

For a small nonabsorbing sphere, present the Rayleigh scattering cross-section:

\[
\boxed{
\sigma_{\rm sca}
=\frac{8\pi}{3}k_m^4a^6
\left|\frac{m^2-1}{m^2+2}\right|^2
}
\]

with \(k_m=2\pi n_m/\lambda_0\).

Explain the key scaling:

\[
\sigma_{\rm sca}\propto\frac{a^6}{\lambda_0^4}.
\]

This explains why larger aggregates scatter dramatically more strongly and why short wavelengths scatter more strongly.

### 8.3 Rayleigh absorption cross-section

For an absorbing small sphere, introduce

\[
\sigma_{\rm ext}=4\pi k_ma^3\,
\mathrm{Im}
\left(
\frac{m^2-1}{m^2+2}
\right),
\]

and

\[
\boxed{\sigma_{\rm abs}=\sigma_{\rm ext}-\sigma_{\rm sca}}.
\]

Explain that this connects nanoparticle absorption and scattering to the same complex dielectric contrast that appeared in the local-field factor.

### 8.4 Mie scattering: particles comparable to the wavelength

Define the Mie regime as \(x\sim1\). Explain that one must solve Maxwell’s equations using vector spherical harmonics; no single \(a^6/\lambda^4\) scaling remains.

Present the compact final Mie sums without deriving every coefficient in the main text:

\[
Q_{\rm ext}=
\frac{2}{x^2}\sum_{\ell=1}^{\infty}(2\ell+1)
\mathrm{Re}(a_\ell+b_\ell),
\]

\[
Q_{\rm sca}=
\frac{2}{x^2}\sum_{\ell=1}^{\infty}(2\ell+1)
(|a_\ell|^2+|b_\ell|^2),
\]

\[
Q_{\rm abs}=Q_{\rm ext}-Q_{\rm sca},
\qquad
\sigma_j=Q_j\pi a^2.
\]

Put the detailed derivation of \(a_\ell\) and \(b_\ell\) in an appendix or a companion post. In the main narrative, explain the physical outcomes: multipole resonances, forward scattering, size-dependent angular distribution, and interference colors.

### 8.5 From single-particle cross-sections to a sample

For number density \(N\), write

\[
\mu_a=N\sigma_{\rm abs},
\qquad
\mu_s=N\sigma_{\rm sca},
\qquad
\mu_t=N\sigma_{\rm ext}.
\]

Introduce the anisotropy parameter \(g=\langle\cos\theta\rangle\) only if discussing multiple scattering, and define the reduced scattering coefficient:

\[
\mu_s'=\mu_s(1-g).
\]

### 8.6 Experimental signatures: absorption or scattering?

Provide a diagnostic checklist:

- Stronger apparent absorption at short wavelength with a smooth \(\lambda^{-4}\)-like baseline: suspect Rayleigh scattering.
- Increasing baseline after aggregation or poor dispersion: suspect scattering.
- Detector-position or aperture dependence: scattering is likely.
- Integrating sphere substantially changes transmission or reflectance: scattering is important.
- Narrow peaks at known interband/excitonic energies that remain under integrating-sphere measurement: more likely genuine absorption.

---

## 9. A unified equation map

Place this near the end as a visual “mental model.”

\[
\epsilon_r=\epsilon_1+i\epsilon_2
\longleftrightarrow
\tilde n=n+i\kappa
\]

\[
\epsilon_1=n^2-\kappa^2,
\qquad
\epsilon_2=2n\kappa
\]

\[
\kappa
\longrightarrow
\alpha=\frac{4\pi\kappa}{\lambda_0}
\longrightarrow
T=e^{-\alpha L}
\longrightarrow
A=\frac{\alpha L}{\ln10}
\]

\[
\alpha=N\sigma_{\rm abs}
\]

\[
\text{nanoparticle composite:}\qquad
E_{\rm in}=fE_0,
\quad
f=\frac{3\epsilon_m}{\epsilon_p+2\epsilon_m},
\quad
\alpha_{\rm composite}\propto p|f|^2\epsilon_{p,2}.
\]

\[
\text{scattering medium:}\qquad
\mu_t=\mu_a+\mu_s,
\quad
I_{\rm ballistic}=I_0e^{-\mu_tL}.
\]

---

## 10. Practical workflow for interpreting a semiconductor optical spectrum

1. Identify the sample geometry: bulk crystal, thin film, solution, colloidal nanocrystal dispersion, or composite.
2. Measure thickness/path length and determine whether reflection and scattering are appreciable.
3. Convert the reported quantity correctly: \(T\leftrightarrow A\leftrightarrow\alpha\), with consistent units.
4. Decide whether the measured loss is absorption only or extinction \((\mu_a+\mu_s)\).
5. For a bulk medium, relate \(\alpha\) to \(k\), \(n\), and \(\epsilon_2\).
6. Assign spectral features using band-gap, excitonic, phonon-assisted, defect, and free-carrier mechanisms.
7. For nanocrystals in a matrix, account for volume fraction and dielectric local-field corrections before claiming an intrinsic particle property.
8. For particles not deeply subwavelength, calculate or measure scattering; do not force a Beer-Lambert absorption interpretation.
9. State the model limitations next to every extracted parameter.

---

## 11. Suggested figures, boxes, and appendices

### Main-text figures

1. **Light budget at a sample:** reflected, transmitted, absorbed, and scattered pathways.
2. **Thin-slab derivation:** successive infinitesimal layers leading to exponential attenuation.
3. **Band diagrams:** direct, indirect, excitonic, and defect-assisted absorption.
4. **Complex optical constants:** \(\epsilon_1\), \(\epsilon_2\), \(n\), \(k\), and \(\alpha\) versus photon energy for one direct-gap semiconductor.
5. **Dielectric sphere:** external field, induced surface charges, internal field, and definition of \(f\).
6. **Rayleigh versus Mie regimes:** size parameter \(x\), angular scattering pattern, and wavelength dependence.
7. **Decision tree:** “My measured absorbance increased: absorption, reflection, or scattering?”

### Recommended boxed examples

- Unit conversion: \(200\ \mathrm{nm}=2.00\times10^{-5}\ \mathrm{cm}\).
- \(A\), \(T\), and \(\alpha\) for one simple film.
- Convert a reported \(\varepsilon_{\rm mol}\) to \(\sigma_{\rm abs}\).
- Calculate \(\alpha\) from a tabulated \(k\) at one wavelength.
- CdSe-in-glass local-field estimate and why \(|f|^2\), not \(|f|\), scales a linear absorption rate.
- A nanoparticle dispersion in which apparent absorbance is dominated by scattering.

### Appendices

**Appendix A. Units and notation**

- SI, Gaussian-cgs, and spectroscopy conventions.
- Difference between \(\epsilon_0\), vacuum permittivity, and a host-material relative dielectric constant. Use \(\epsilon_{\rm vac}\) for vacuum permittivity and \(\epsilon_m\) for matrix dielectric constant in the main text to avoid ambiguity.
- Difference between wavelength in vacuum and wavelength in a medium.

**Appendix B. Derivation details**

- Fermi’s golden-rule route to direct-gap absorption.
- Laplace-equation boundary-value derivation of the spherical local-field factor.
- Complex-wave derivation of \(\alpha=4\pi\kappa/\lambda_0\).
- Optional Mie coefficients \(a_\ell\) and \(b_\ell\).

**Appendix C. Measurement and fitting methods**

- UV-vis transmission/absorbance.
- Integrating-sphere transmission and reflectance.
- Ellipsometry for \(n\) and \(k\).
- Photothermal deflection or photoacoustic methods for absorption in scattering samples.
- Dynamic light scattering/TEM for diagnosing particle size and aggregation.

---

## 12. Closing section: the five distinctions readers should retain

1. \(A\) is a logarithmic measurement; \(\alpha\) is a physical attenuation rate per distance.
2. \(k\) is the imaginary refractive index; it becomes \(\alpha\) through \(\alpha=4\pi k/\lambda_0\).
3. \(\epsilon_2\) is the absorptive part of the dielectric response; \(\epsilon_1\) mainly governs dispersion and dielectric contrast.
4. A measured transmission loss is not automatically absorption: reflection and scattering can contribute.
5. In a nanocrystal composite, the external field is not necessarily the field inside a particle; local-field factors can substantially change both linear and nonlinear optical response.

## Pre-publication accuracy checklist

- Verify every material-specific optical constant, band gap, and absorption value against a primary source or authoritative database at the stated temperature.
- State wavelength, temperature, crystal phase, sample geometry, and polarization when they affect the comparison.
- Never use \(\epsilon_0\) for both vacuum permittivity and the matrix dielectric constant in the same post.
- Keep \(\alpha\) (absorption coefficient) and \(\alpha_{\rm pol}\) (polarizability) visually distinct.
- Label all approximations: dilute composite, quasistatic particle, normal incidence, nonmagnetic material, weak absorption, and negligible scattering.
- If including numerical Mie calculations, specify the complex refractive index of both particle and medium and the particle-size distribution.






