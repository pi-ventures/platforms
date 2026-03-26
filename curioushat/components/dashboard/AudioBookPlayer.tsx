'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Play, Pause, SkipBack, SkipForward, Headphones, ChevronUp, ChevronDown, Volume2, BookOpen, RotateCcw, Bookmark, BookMarked, Trash2 } from 'lucide-react'
import type { Book } from './AITutorPanel'

/* ═══════════════════════════════════════════════════════
   CHAPTER CONTENT — class-level aware
   ═══════════════════════════════════════════════════════ */
type Level = 'elementary' | 'middle' | 'secondary' | 'higher' | 'competitive' | 'general'
type Chapter = { title: string; text: string }

function getLevel(classLevel: string): Level {
  if (/Class (I|II|III|IV|V)\b/i.test(classLevel) && !/Class (VI|VII|VIII|IX|XI|XII)/i.test(classLevel)) return 'elementary'
  if (/Class (VI|VII|VIII)/i.test(classLevel)) return 'middle'
  if (/Class (IX|X)\b/i.test(classLevel) && !/Class XI|XII/i.test(classLevel)) return 'secondary'
  if (/Class (XI|XII)/i.test(classLevel)) return 'higher'
  if (/JEE|NEET/i.test(classLevel)) return 'competitive'
  return 'general'
}

const CHAPTERS: Partial<Record<string, Partial<Record<Level, Chapter[]>>>> = {
  Mathematics: {
    elementary: [
      { title: 'Ch 1: Numbers and Counting', text: 'Numbers help us count the things around us. We start counting from one. One, two, three, four, five — these are our first numbers. When we have one apple and our friend gives us one more apple, we have two apples. This is called addition. If we have five sweets and we eat two, we are left with three sweets. This is subtraction. Shapes are everywhere around us. A ball is round like a circle. A box has faces that look like squares and rectangles. We measure length to find out how long something is. We use rulers to measure in centimetres. Time tells us when things happen — morning, afternoon, and night.' },
      { title: 'Ch 2: Addition and Subtraction', text: 'Addition means putting numbers together to find the total. When we add, we use the plus sign. Two plus three equals five. We can add small numbers in our head. For bigger numbers, we write them in columns and add starting from the ones place. Subtraction means taking one number away from another. We use the minus sign for subtraction. Ten minus four equals six. The number we start with is called the minuend. The number we take away is called the subtrahend. The answer is called the difference. We use addition and subtraction every day — when sharing things, counting money, or measuring.' },
      { title: 'Ch 3: Multiplication and Division', text: 'Multiplication is a quick way of adding the same number many times. Three multiplied by four means three groups of four, which equals twelve. We learn multiplication tables to help us multiply quickly. The table of two: two, four, six, eight, ten. The table of five: five, ten, fifteen, twenty, twenty-five. Division means sharing equally. If we have twelve chocolates and want to share them equally among three friends, each friend gets four chocolates. Twelve divided by three equals four. Division and multiplication are opposite operations. Knowing one helps us with the other.' },
      { title: 'Ch 4: Shapes and Patterns', text: 'Look around you and you will find shapes everywhere. A door is a rectangle. A clock face is a circle. A sandwich cut diagonally makes two triangles. A square has four equal sides and four corners. A rectangle has two long sides and two short sides. A triangle has three sides and three corners. A circle has no corners at all. Patterns repeat in a regular way. Red, blue, red, blue is a pattern. Patterns are found in nature, in textiles, in buildings, and in mathematics. When we tile a floor, we use patterns. Symmetry is when both sides of a shape look the same.' },
      { title: 'Ch 5: Measurement and Money', text: 'We measure length to know how long or tall something is. We measure weight to know how heavy something is. We measure capacity to know how much a container can hold. In India we use the metric system. Length is measured in centimetres and metres. Weight is measured in grams and kilograms. Capacity is measured in millilitres and litres. Money helps us buy and sell things. In India we use rupees and paise. One hundred paise make one rupee. Coins come in values of one, two, five, and ten rupees. Notes come in values of ten, twenty, fifty, one hundred, two hundred, and five hundred rupees.' },
    ],
    middle: [
      { title: 'Ch 1: Integers and Fractions', text: 'Integers include all whole numbers and their negatives: minus three, minus two, minus one, zero, one, two, three. Negative integers are less than zero. Temperature below zero, floors below ground level, and debt are real-life examples of negative integers. A number line helps us visualise integers. Fractions represent parts of a whole. The number above the line is the numerator. The number below is the denominator. Three-fourths means three parts out of four equal parts. Equivalent fractions have the same value. Half is equal to two-fourths and three-sixths. To add fractions, we need a common denominator.' },
      { title: 'Ch 2: Ratio, Proportion and Percentage', text: 'A ratio compares two quantities of the same kind. If there are three boys and five girls, the ratio of boys to girls is three to five, written as 3:5. Ratios should be expressed in their simplest form. A proportion states that two ratios are equal. If a recipe for four people uses two cups of flour, for eight people we need four cups — this is proportion. Percentage means per hundred. Fifty percent means fifty out of every hundred. To find a percentage, we divide the part by the whole and multiply by one hundred. Discounts in shops, examination marks, and interest rates are expressed as percentages.' },
      { title: 'Ch 3: Algebra — Introduction to Variables', text: 'Algebra uses letters to represent unknown numbers or quantities that can change. These letters are called variables. If a pen costs x rupees, and we buy five pens, the total cost is five-x rupees. An expression is a combination of numbers, variables, and operations. An equation states that two expressions are equal. To solve an equation, we find the value of the variable that makes it true. If x plus three equals seven, then x equals four. We use algebra to solve problems where we do not know one of the quantities. Formulas in science and everyday life are algebraic expressions.' },
      { title: 'Ch 4: Geometry — Lines and Angles', text: 'A line extends infinitely in both directions. A ray starts at a point and extends infinitely in one direction. A line segment has two endpoints. When two rays meet at a point, they form an angle. Angles are measured in degrees. A right angle measures ninety degrees. An acute angle is less than ninety degrees. An obtuse angle is between ninety and one hundred and eighty degrees. A straight angle measures one hundred and eighty degrees. Parallel lines never meet. Perpendicular lines meet at right angles. A transversal is a line that cuts two or more parallel lines. Corresponding angles, alternate angles, and co-interior angles are formed.' },
      { title: 'Ch 5: Data Handling', text: 'Data is information collected for a purpose. Raw data is data in its original form before it is organised. Tally marks help us count data into groups. A frequency table shows how often each value occurs. A bar graph uses bars of different heights to show data. A pie chart shows data as slices of a circle, where each slice represents a proportion of the total. The mean is the average of a set of data. The median is the middle value when data is arranged in order. The mode is the value that occurs most often. These are called measures of central tendency and help us summarise data.' },
    ],
    secondary: [
      { title: 'Ch 1: Number Systems', text: 'The number system includes natural numbers, whole numbers, integers, rational numbers, and real numbers. A rational number can be expressed as p divided by q where p and q are integers and q is not zero. Irrational numbers cannot be expressed as fractions. Pi and the square root of two are irrational. Together, rational and irrational numbers make up the real numbers. Every real number can be represented on a number line. The decimal expansion of a rational number is either terminating or non-terminating repeating. The decimal expansion of an irrational number is non-terminating and non-repeating.' },
      { title: 'Ch 2: Polynomials', text: 'A polynomial is an algebraic expression with one or more terms. The degree of a polynomial is the highest power of the variable. A polynomial of degree one is linear. Degree two is quadratic. Degree three is cubic. The zero of a polynomial is the value of the variable for which the polynomial equals zero. The Remainder Theorem states that when a polynomial is divided by a linear expression, the remainder equals the polynomial evaluated at the root. The Factor Theorem is a special case — if a value gives zero remainder, it is a factor. Polynomials are added and subtracted by combining like terms.' },
      { title: 'Ch 3: Coordinate Geometry', text: 'The Cartesian plane has two perpendicular axes. The horizontal axis is the x-axis. The vertical axis is the y-axis. Their intersection is the origin with coordinates zero comma zero. Any point in the plane is represented by an ordered pair of coordinates. The plane is divided into four quadrants. In the first quadrant, both coordinates are positive. The distance between two points is calculated using the distance formula derived from the Pythagorean theorem. The midpoint of a line segment joining two points has coordinates equal to the average of the respective coordinates.' },
      { title: 'Ch 4: Linear Equations in Two Variables', text: 'A linear equation in two variables has the form ax plus by plus c equals zero, where a and b are not both zero. Every linear equation has infinitely many solutions, each of which is a point on a line. To draw the graph, we find at least two solutions and join them. Two linear equations with two variables form a pair of simultaneous equations. Graphically, we look for the point of intersection of the two lines. The three cases are: exactly one solution where lines intersect, no solution where lines are parallel, and infinitely many solutions where lines coincide.' },
      { title: 'Ch 5: Triangles and Theorems', text: 'Two triangles are congruent if they have exactly the same size and shape. Congruence conditions include SAS, ASA, AAS, SSS, and RHS. Two triangles are similar if they have the same shape but not necessarily the same size. The Basic Proportionality Theorem states that if a line is drawn parallel to one side of a triangle, it divides the other two sides in the same ratio. Pythagoras Theorem states that in a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides. Areas of similar triangles are proportional to the squares of their corresponding sides.' },
      { title: 'Ch 6: Statistics and Probability', text: 'Statistics involves collecting, organising, and interpreting numerical data. Measures of central tendency — mean, median, and mode — describe the centre of a data set. Mean is the sum of all values divided by the number of values. Median is the middle value. Mode is the most frequent value. Probability measures the likelihood of an event. It ranges from zero to one. An impossible event has probability zero. A certain event has probability one. The probability of an event is the number of favourable outcomes divided by the total number of equally likely outcomes. Complementary events have probabilities that add up to one.' },
    ],
    higher: [
      { title: 'Ch 1: Sets and Relations', text: 'A set is a well-defined collection of objects called elements. Sets are denoted by capital letters. The null or empty set has no elements. A subset contains elements that all belong to the parent set. The union of two sets contains all elements from both sets. The intersection contains only common elements. The complement contains all elements not in the set. Relations describe connections between elements of sets. A function is a special relation where every element in the domain is related to exactly one element in the range. Functions can be one-one, onto, or bijective.' },
      { title: 'Ch 2: Trigonometry', text: 'Trigonometry studies the relationships between angles and sides of triangles. The six trigonometric ratios are sine, cosine, tangent, cosecant, secant, and cotangent. For angle theta: sine is opposite over hypotenuse, cosine is adjacent over hypotenuse, tangent is opposite over adjacent. Trigonometric identities are equations true for all values. The fundamental identity: sine squared plus cosine squared equals one. Angles measured in radians. Pi radians equals one hundred and eighty degrees. Trigonometric functions have specific values at standard angles: zero, thirty, forty-five, sixty, and ninety degrees.' },
      { title: 'Ch 3: Limits and Derivatives', text: 'The concept of a limit describes the value a function approaches as the input approaches a given value. If the limit from the left equals the limit from the right, the limit exists. Continuity requires the limit to equal the function value at that point. A derivative measures the instantaneous rate of change of a function. Geometrically, the derivative at a point equals the slope of the tangent line at that point. The derivative of x to the power n is n times x to the power n minus one. The chain rule, product rule, and quotient rule help differentiate composite, product, and quotient functions.' },
      { title: 'Ch 4: Probability and Statistics', text: 'Conditional probability is the probability of an event given that another event has occurred. The multiplication theorem: probability of A and B equals probability of A times probability of B given A. Bayes theorem relates conditional probabilities and allows updating probabilities based on new information. Random variables assign numerical values to outcomes. A discrete random variable has countable values. A continuous random variable can take any value in an interval. The binomial distribution models the number of successes in a fixed number of independent trials. Mean and variance of distributions describe their central tendency and spread.' },
      { title: 'Ch 5: Vectors and 3D Geometry', text: 'A vector has both magnitude and direction. Vectors are represented by directed line segments. The magnitude of a vector is its length. Two vectors are equal if they have the same magnitude and direction. Vector addition follows the triangle law or the parallelogram law. The dot product of two vectors is a scalar equal to the product of their magnitudes and the cosine of the angle between them. The cross product gives a vector perpendicular to both. In three-dimensional geometry, a point has three coordinates. The distance formula and section formula extend naturally to three dimensions. Equations of lines and planes in space use direction vectors.' },
    ],
    competitive: [
      { title: 'Ch 1: Algebra and Complex Numbers', text: 'Complex numbers extend the real number system by including the square root of minus one, denoted by i. A complex number has the form a plus bi where a is the real part and b is the imaginary part. The modulus of a complex number is its distance from the origin in the Argand plane. The argument is the angle it makes with the positive real axis. De Moivre theorem: the n-th power of a complex number in polar form equals the modulus raised to n times the angle multiplied by n. Quadratic equations with negative discriminant have complex roots. Sequences, series, arithmetic progression, and geometric progression appear frequently in JEE.' },
      { title: 'Ch 2: Calculus for JEE', text: 'Limits form the foundation of calculus. Standard limits include sine x over x approaches one as x approaches zero. L\'Hopital\'s rule resolves indeterminate forms. Differentiation is the process of finding rates of change. Integration is the reverse — finding areas and accumulations. The fundamental theorem of calculus connects differentiation and integration. Techniques include substitution, integration by parts, partial fractions, and trigonometric substitution. Definite integrals compute areas between curves. Applications include maxima and minima, rate problems, and areas of irregular regions. Differential equations model growth, decay, and motion.' },
      { title: 'Ch 3: Coordinate Geometry Advanced', text: 'The straight line in various forms: slope-intercept, point-slope, intercept form, and normal form. Distance from a point to a line. Family of lines through intersection of two lines. Circle: standard form and general form. Condition for a line to be tangent to a circle. Parabola, ellipse, and hyperbola are conic sections obtained by cutting a cone with a plane. The eccentricity determines the type of conic. Tangents and normals to conics. Pair of tangents from an external point. Chord of contact. The polar of a point with respect to a conic. Parametric representations of conics simplify many problems.' },
      { title: 'Ch 4: Permutations, Combinations and Probability', text: 'The fundamental principle of counting: if one event can occur in m ways and another in n ways, together they can occur in m times n ways. Permutation is an arrangement where order matters. The number of permutations of n objects taken r at a time is n factorial divided by n minus r factorial. Combination is a selection where order does not matter. The binomial theorem expands a plus b to the power n using combinations as coefficients. Binomial coefficients follow Pascal\'s triangle. Probability theory: sample space, events, and axioms. Conditional probability and independence. Total probability theorem and Bayes theorem are essential.' },
    ],
  },

  Physics: {
    middle: [
      { title: 'Ch 1: Motion and Measurement', text: 'Everything around us is either moving or at rest. Motion is the change in position of an object over time. We need a reference point to decide if something is moving. A car parked on a road is at rest relative to the road but moving relative to the Sun. Speed tells us how fast something moves — it is distance divided by time. We measure length using rulers and measuring tapes. The unit of length in the metric system is the metre. Smaller lengths use centimetres and millimetres. Larger distances use kilometres. Mass is the amount of matter in an object. Weight is the gravitational force on an object.' },
      { title: 'Ch 2: Force and Newton\'s Laws', text: 'A force is a push or a pull. Forces can change the speed or direction of a moving object, or bring a stationary object into motion. Isaac Newton formulated three laws of motion that explain how forces affect objects. The first law states that objects stay at rest or move in a straight line unless a force acts on them — this is inertia. The second law: force equals mass times acceleration. A larger force causes greater acceleration. The third law: for every action there is an equal and opposite reaction. When you push a wall, the wall pushes back on you with equal force.' },
      { title: 'Ch 3: Light and Sound', text: 'Light is a form of energy that travels in straight lines at extremely high speed — about three lakh kilometres per second in vacuum. Light can be reflected, refracted, and absorbed. A mirror reflects light according to the law of reflection — the angle of incidence equals the angle of reflection. A convex mirror curves outward and forms virtual, diminished images. A concave mirror curves inward and can form real or virtual images. Lenses refract light. Sound is a mechanical wave that needs a medium to travel. Sound travels faster in solids than in liquids, and faster in liquids than in gases. Loud sounds have large amplitude. High-pitched sounds have high frequency.' },
    ],
    secondary: [
      { title: 'Ch 1: Motion', text: 'Motion is described using displacement, velocity, and acceleration. Displacement is the change in position and is a vector. Distance is the total path length and is a scalar. Average speed is total distance divided by total time. Average velocity is displacement divided by time. Acceleration is the rate of change of velocity. For uniformly accelerated motion, we use the equations of motion. The first equation: final velocity equals initial velocity plus acceleration times time. The second equation: displacement equals initial velocity times time plus half of acceleration times time squared. The third equation: final velocity squared equals initial velocity squared plus two times acceleration times displacement.' },
      { title: 'Ch 2: Force and Laws of Motion', text: 'Newton\'s first law tells us that a body remains at rest or in uniform motion unless acted upon by an external force. This property is called inertia, and it depends on mass. Newton\'s second law defines force: net force equals mass times acceleration. The unit of force is the Newton. Newton\'s third law: every action has an equal and opposite reaction. Forces always occur in pairs. The law of conservation of momentum states that in the absence of external forces, the total momentum of a system remains constant. Momentum is mass times velocity. Impulse is the change in momentum and equals force times time.' },
      { title: 'Ch 3: Gravitation', text: 'Every object in the universe attracts every other object with a gravitational force. Newton\'s law of universal gravitation: the force is directly proportional to the product of the masses and inversely proportional to the square of the distance between them. The gravitational constant G has a value of 6.67 times ten to the power minus eleven Newton metre squared per kilogram squared. On Earth, gravity accelerates falling objects at 9.8 metres per second squared. The weight of an object is the gravitational force on it: weight equals mass times g. Kepler\'s laws describe planetary motion. Satellites orbit due to the gravitational pull of the planet.' },
      { title: 'Ch 4: Work, Energy and Power', text: 'Work is done when a force causes displacement in the direction of the force. Work equals force times displacement times cosine of the angle between them. The unit of work is the joule. Energy is the ability to do work. Kinetic energy is the energy of motion: one-half mass times velocity squared. Potential energy is stored energy due to position or configuration. Gravitational potential energy equals mass times g times height. The law of conservation of energy: energy cannot be created or destroyed, only transformed. Power is the rate of doing work: power equals work divided by time. The unit of power is the watt.' },
      { title: 'Ch 5: Sound and Light', text: 'Sound is produced by vibrating objects and travels as a longitudinal wave through a medium. Speed of sound in air at 25 degrees Celsius is about 346 metres per second. Frequency determines pitch. Amplitude determines loudness. The human ear hears between 20 hertz and 20,000 hertz. Echoes are reflected sounds. Ultrasound above 20,000 hertz is used in medical scanning and sonar. Light travels at 3 times 10 to the 8 metres per second in vacuum. The laws of reflection and refraction govern how light behaves at surfaces. Spherical mirrors and lenses form images. The mirror formula and lens formula relate object distance, image distance, and focal length.' },
    ],
    higher: [
      { title: 'Ch 1: Electrostatics', text: 'Electric charge is a fundamental property of matter. There are two types: positive and negative. Like charges repel; unlike charges attract. Coulomb\'s law gives the force between two point charges: it is proportional to the product of charges and inversely proportional to the square of the distance. The electric field is the force per unit positive charge at a point. Field lines show direction and strength of the field. Electric potential is the work done per unit charge to bring a test charge from infinity. Capacitors store electric energy. Capacitance depends on geometry and the material between the plates. Energy stored in a capacitor is half times capacitance times voltage squared.' },
      { title: 'Ch 2: Current Electricity', text: 'Electric current is the rate of flow of charge. Its unit is the ampere. Ohm\'s law states voltage equals current times resistance for ohmic conductors. Resistance depends on material, length, and cross-sectional area. Resistivity is a property of the material. In a series circuit, total resistance is the sum of individual resistances. In a parallel circuit, the reciprocal of total resistance is the sum of reciprocals. Kirchhoff\'s voltage law: the sum of EMFs equals the sum of voltage drops in a loop. Kirchhoff\'s current law: the sum of currents entering a junction equals the sum leaving. Power in a circuit equals current squared times resistance.' },
      { title: 'Ch 3: Magnetism and Electromagnetic Induction', text: 'A magnetic field exerts force on moving charges. The Lorentz force on a charge moving in a magnetic field is charge times velocity cross magnetic field. A current-carrying conductor in a magnetic field experiences a force. This is the basis of electric motors. Faraday\'s law of electromagnetic induction: an EMF is induced whenever there is a change in magnetic flux through a circuit. Lenz\'s law: the induced current opposes the change that caused it. A transformer uses electromagnetic induction to change AC voltages. Step-up transformers increase voltage; step-down transformers decrease it. Self-inductance and mutual inductance are properties of coils.' },
      { title: 'Ch 4: Optics', text: 'Reflection follows the law: angle of incidence equals angle of reflection. Refraction follows Snell\'s law: n1 sine theta1 equals n2 sine theta2. Total internal reflection occurs when light travels from denser to rarer medium at angles beyond the critical angle. Optical fibres use total internal reflection. Lenses form images according to the lens formula: one over v minus one over u equals one over f. The eye forms images on the retina. Common defects are myopia, hypermetropia, and astigmatism, corrected by lenses. Interference of light produces bright and dark fringes. Diffraction causes bending around obstacles. Polarisation shows light is a transverse wave.' },
      { title: 'Ch 5: Modern Physics', text: 'The photoelectric effect showed that light comes in packets called photons. Einstein explained that the energy of a photon is Planck\'s constant times frequency. This was revolutionary. Bohr\'s model of the hydrogen atom quantised the angular momentum and explained spectral lines. De Broglie proposed that particles have wave properties — wavelength equals Planck\'s constant divided by momentum. Radioactivity is the spontaneous emission of particles or radiation from unstable nuclei. Alpha particles are helium nuclei. Beta particles are electrons or positrons. Gamma rays are high-energy photons. The half-life is the time for half the nuclei to decay. Nuclear fission splits heavy nuclei; fusion combines light ones.' },
    ],
    competitive: [
      { title: 'Ch 1: Mechanics — Advanced', text: 'In JEE Physics, mechanics is the foundation. Kinematics in two dimensions uses vector components. Projectile motion: horizontal velocity is constant, vertical motion is uniformly accelerated. The range, time of flight, and maximum height are key results. Circular motion: centripetal acceleration equals velocity squared over radius. Relative motion: subtract the reference frame\'s velocity. Newton\'s laws apply in inertial frames. Pseudo force appears in non-inertial frames. Work-energy theorem: net work equals change in kinetic energy. Conservative forces have associated potential energy. Non-conservative forces like friction dissipate energy. Collisions: elastic conserves kinetic energy; inelastic does not.' },
      { title: 'Ch 2: Waves and Oscillations', text: 'Simple harmonic motion is characterised by a restoring force proportional to displacement. Period of a spring-mass system: two pi times root of mass over spring constant. Period of a simple pendulum: two pi times root of length over g, valid for small angles. Superposition of waves: constructive interference when path difference is an integral multiple of wavelength. Destructive interference when path difference is a half-integer multiple. Standing waves are formed by superposition of identical waves travelling in opposite directions. Resonance occurs when driving frequency matches natural frequency. Sound waves: beats are produced by two slightly different frequencies. Doppler effect: observed frequency changes with relative motion of source and observer.' },
    ],
  },

  Chemistry: {
    secondary: [
      { title: 'Ch 1: Matter and Its Properties', text: 'Matter is anything that has mass and occupies space. The three common states are solid, liquid, and gas, which differ in the arrangement and energy of their particles. In solids, particles vibrate about fixed positions. In liquids, they move but stay close together. In gases, particles move freely and fast. Changes of state — melting, freezing, evaporation, condensation, sublimation — involve energy changes. A pure substance has a definite composition and properties. Elements are the simplest pure substances. Compounds are formed by chemical combination of elements. Mixtures contain two or more substances not chemically combined and can be separated by physical methods.' },
      { title: 'Ch 2: Atoms and Molecules', text: 'Dalton\'s atomic theory proposed that matter is made of tiny indivisible atoms. Each element has atoms of a specific mass. Compounds are made of molecules — definite combinations of atoms. The atomic mass unit is one-twelfth the mass of a carbon-12 atom. The mole concept: one mole of any substance contains Avogadro\'s number of particles — 6.022 times ten to the 23. The molar mass in grams equals the atomic or molecular mass in atomic mass units. The number of moles equals mass divided by molar mass. Chemical formulae show the composition of compounds. Structural formulae show how atoms are bonded. Law of conservation of mass: mass is conserved in chemical reactions.' },
      { title: 'Ch 3: Structure of the Atom', text: 'Thomson\'s plum pudding model proposed electrons embedded in positive matter. Rutherford\'s gold foil experiment showed the atom has a tiny, dense, positive nucleus with electrons orbiting at a distance. Bohr\'s model quantised orbits for hydrogen — electrons occupy fixed energy levels. Electrons can jump between levels by absorbing or emitting photons. Neutrons were discovered later. Atomic number equals number of protons. Mass number equals protons plus neutrons. Isotopes have the same atomic number but different mass numbers. The electronic configuration places electrons in shells: 2, 8, 8, 18. Valence electrons in the outermost shell determine chemical behaviour.' },
      { title: 'Ch 4: Chemical Bonding', text: 'Atoms bond to achieve stable electronic configurations, usually a full outer shell like noble gases. Ionic bonds form between metals and non-metals by transfer of electrons. Metal atoms lose electrons to form positive ions. Non-metal atoms gain electrons to form negative ions. The electrostatic attraction between opposite ions is the ionic bond. Covalent bonds form by sharing electrons between non-metal atoms. Single bonds share one pair, double bonds share two, triple bonds share three. Coordinate bonds form when one atom provides both electrons. Metallic bonds in metals involve a sea of delocalised electrons. Bond polarity arises from differences in electronegativity.' },
      { title: 'Ch 5: Chemical Reactions', text: 'A chemical reaction converts reactants to products. The balanced chemical equation shows the ratio of particles involved. Types of reactions: combination — two substances combine to form one product. Decomposition — one substance breaks into two or more products. Displacement — a more reactive element displaces a less reactive one from its compound. Double displacement — ions exchange between two compounds. Oxidation involves loss of electrons or gain of oxygen. Reduction involves gain of electrons or loss of oxygen. Redox reactions involve both simultaneously. Exothermic reactions release heat. Endothermic reactions absorb heat. Catalysts speed up reactions without being consumed.' },
    ],
    higher: [
      { title: 'Ch 1: Atomic Structure and Chemical Bonding', text: 'Quantum mechanical model describes electrons as waves. The Schrödinger equation gives wave functions called orbitals. Orbitals are regions of high electron density. Quantum numbers describe electron states: principal n, azimuthal l, magnetic m, and spin s. Orbital shapes: s is spherical, p is dumbbell-shaped, d is more complex. The Aufbau principle fills orbitals in order of increasing energy. Pauli exclusion principle: no two electrons have identical quantum numbers. Hund\'s rule: degenerate orbitals are singly occupied before pairing. VSEPR theory predicts molecular geometry from electron pairs. Hybridisation explains bonding — sp3 in methane, sp2 in ethylene, sp in acetylene.' },
      { title: 'Ch 2: Thermodynamics', text: 'Thermodynamics studies energy changes in chemical reactions. System is the part we study; surroundings is everything else. Enthalpy H is the heat content at constant pressure. The enthalpy change of a reaction is products minus reactants. Exothermic reactions have negative delta H. Endothermic have positive delta H. Hess\'s law: the total enthalpy change is independent of the path. Bond enthalpy is the energy to break one mole of bonds in gaseous molecules. Entropy S measures disorder. The second law: entropy of an isolated system increases. Gibbs free energy G equals enthalpy minus temperature times entropy. A reaction is spontaneous if delta G is negative.' },
      { title: 'Ch 3: Electrochemistry', text: 'Electrochemistry studies the relationship between chemical energy and electrical energy. In a galvanic or voltaic cell, a spontaneous redox reaction generates electrical energy. The cell potential is the difference between reduction potentials of cathode and anode. The standard hydrogen electrode has a potential of zero by convention. The Nernst equation relates cell potential to concentration. A non-spontaneous reaction can be driven by electrical energy in an electrolytic cell. Faraday\'s laws of electrolysis: the mass of substance deposited is proportional to the charge passed and to the equivalent mass. Batteries, fuel cells, and corrosion are practical applications.' },
      { title: 'Ch 4: Organic Chemistry', text: 'Organic chemistry studies carbon compounds. Carbon forms four covalent bonds and can bond to itself in chains and rings. Alkanes are saturated hydrocarbons with single bonds. Alkenes contain double bonds. Alkynes contain triple bonds. Functional groups determine chemical properties. Hydroxyl group: alcohols. Carbonyl group: aldehydes and ketones. Carboxyl group: carboxylic acids. Amino group: amines. Reaction types: substitution replaces an atom or group. Addition adds atoms across a double or triple bond. Elimination removes atoms to form a double bond. Isomers have the same molecular formula but different structures. Stereoisomers have the same connectivity but different spatial arrangements.' },
    ],
    competitive: [
      { title: 'Ch 1: Physical Chemistry for JEE', text: 'Mole concept and stoichiometry are fundamental. Concentration terms: molarity, molality, mole fraction, normality. Colligative properties depend on the number of solute particles: elevation of boiling point, depression of freezing point, osmotic pressure, relative lowering of vapour pressure. Chemical kinetics: rate of reaction, rate law, order of reaction. Integrated rate equations for zero, first, and second order. Half-life of first order reactions. Arrhenius equation relates rate constant to temperature. Chemical equilibrium: the equilibrium constant K relates concentrations of products and reactants. Le Chatelier\'s principle predicts the effect of changes on equilibrium.' },
      { title: 'Ch 2: Organic Chemistry for JEE', text: 'Reaction mechanisms are crucial for JEE. SN1 and SN2 nucleophilic substitution — understand stereochemistry and factors affecting each pathway. E1 and E2 elimination. Electrophilic aromatic substitution on benzene: nitration, halogenation, sulphonation. Directing effects of substituents — activating groups direct to ortho and para, deactivating groups to meta. Carbonyl chemistry: nucleophilic addition to aldehydes and ketones. Aldol condensation, Cannizzaro reaction, Wittig reaction. Amines: basicity, reactions. Named reactions to know: Grignard, Clemmensen, Wolff-Kishner, Reformatsky. Carbohydrates, amino acids, and polymers are important topics.' },
    ],
  },

  Biology: {
    middle: [
      { title: 'Ch 1: Cell: The Basic Unit', text: 'All living organisms are made of cells. Robert Hooke first saw cells in cork under a microscope in 1665. Cells are of two types: prokaryotic without a nucleus, and eukaryotic with a nucleus. Bacteria are prokaryotes. Plants and animals are eukaryotes. The cell membrane is a thin flexible boundary controlling what enters and leaves. The nucleus contains the genetic material DNA. The cytoplasm is the jelly-like substance filling the cell. Organelles are specialised structures within cells. Mitochondria produce energy. Chloroplasts in plant cells carry out photosynthesis. Cell walls in plants provide extra support. Vacuoles store food, water, and waste.' },
      { title: 'Ch 2: Nutrition in Plants and Animals', text: 'Nutrition is the process of obtaining food for energy, growth, and maintenance. Plants make their own food by photosynthesis — this makes them autotrophs. Photosynthesis occurs in chloroplasts using sunlight, water from roots, and carbon dioxide from air to produce glucose and oxygen. Animals cannot make their own food and are heterotrophs — they eat plants or other animals. Human nutrition involves ingestion, digestion, absorption, assimilation, and egestion. The digestive system breaks food into small molecules the body can use. Starch is broken down to glucose, proteins to amino acids, and fats to fatty acids and glycerol.' },
      { title: 'Ch 3: Respiration and Circulation', text: 'Respiration is the process of releasing energy from food. Aerobic respiration needs oxygen and produces carbon dioxide, water, and energy. Anaerobic respiration occurs without oxygen and produces less energy. In humans, the respiratory system includes the nose, trachea, bronchi, and lungs. The lungs have tiny air sacs called alveoli where gas exchange occurs. The circulatory system transports materials throughout the body. The heart pumps blood. Arteries carry oxygenated blood away from the heart. Veins carry deoxygenated blood back. Capillaries connect arteries and veins. Blood contains red blood cells, white blood cells, platelets, and plasma.' },
    ],
    secondary: [
      { title: 'Ch 1: Life Processes', text: 'Life processes are the basic functions that sustain living organisms. Nutrition provides raw materials and energy. In autotrophic nutrition, organisms use inorganic substances and light energy. The equation for photosynthesis: carbon dioxide plus water in the presence of light and chlorophyll yields glucose plus oxygen. In heterotrophic nutrition, organisms consume complex organic compounds. Human nutrition is holozoic — food is ingested and internally digested. Aerobic respiration releases energy by oxidising glucose in the presence of oxygen: glucose plus oxygen yields carbon dioxide, water, and ATP. Transportation in plants uses xylem for water and minerals, phloem for food. In humans, the heart drives double circulation.' },
      { title: 'Ch 2: Control and Coordination', text: 'Living organisms need to sense and respond to stimuli. In plants, response to stimuli is called tropism. Phototropism is growth toward or away from light. Geotropism is growth in response to gravity. Thigmotropism is response to touch. Plant hormones called phytohormones coordinate growth: auxins, gibberellins, cytokinins, abscisic acid, and ethylene. In animals, the nervous system and endocrine system provide control and coordination. A neuron transmits impulses. A reflex arc is the pathway for an involuntary response. The brain integrates information. Hormones are chemical messengers secreted by endocrine glands into the bloodstream. Insulin regulates blood glucose.' },
      { title: 'Ch 3: Reproduction', text: 'Reproduction ensures continuity of species. Asexual reproduction involves a single parent and produces genetically identical offspring. Methods include binary fission in bacteria, budding in yeast, fragmentation in Planaria, and spore formation in Rhizopus. Vegetative propagation in plants uses roots, stems, or leaves. Sexual reproduction involves two parents and produces genetic variation. In flowering plants, the flower contains male stamens and female carpels. Pollination transfers pollen to the stigma. Fertilisation forms a zygote. In humans, the male reproductive system produces sperm; the female produces eggs. Fertilisation occurs in the fallopian tube. The zygote develops into an embryo, foetus, and then a baby.' },
      { title: 'Ch 4: Heredity and Evolution', text: 'Heredity is the transmission of traits from parents to offspring. Gregor Mendel studied inheritance in pea plants. His law of segregation: alleles separate during gamete formation. Law of independent assortment: genes on different chromosomes are inherited independently. Dominant alleles mask recessive ones. Genotype is the genetic makeup; phenotype is the observable trait. DNA is the genetic material — a double helix of nucleotides. Genes are segments of DNA encoding proteins. Mutations are changes in DNA sequence. Evolution is the change in inherited traits in populations over generations. Evidence from fossils, homologous structures, and molecular biology supports evolution. Natural selection drives evolution.' },
    ],
    higher: [
      { title: 'Ch 1: Cell Biology and Biochemistry', text: 'The cell is the fundamental unit of life. The fluid mosaic model describes the cell membrane as a phospholipid bilayer with embedded proteins. Membrane proteins serve as channels, carriers, receptors, and enzymes. Cell organelles have specific functions. The endoplasmic reticulum is rough with ribosomes for protein synthesis, smooth for lipid metabolism. The Golgi apparatus packages and ships proteins. Lysosomes contain digestive enzymes. Mitochondria carry out cellular respiration — the inner membrane has cristae where the electron transport chain operates. Chloroplasts have thylakoid membranes with photosystems. The cell cycle has interphase and mitosis. Cancer results from uncontrolled cell division.' },
      { title: 'Ch 2: Genetics and Molecular Biology', text: 'DNA is a double helix with complementary base pairing: adenine pairs with thymine, guanine with cytosine. Replication is semiconservative — each new molecule has one old and one new strand. Transcription produces mRNA from DNA template. Translation at ribosomes converts mRNA into protein. The genetic code is triplet — each codon of three bases encodes one amino acid. Mutations include substitutions, insertions, and deletions. Recombinant DNA technology joins DNA from different sources. Restriction enzymes cut at specific sequences. Gel electrophoresis separates DNA fragments by size. PCR amplifies DNA. Applications include genetic engineering, GMO crops, gene therapy, and DNA fingerprinting.' },
      { title: 'Ch 3: Ecology and Environment', text: 'Ecology studies interactions between organisms and their environment. A population is all individuals of one species in an area. A community is all populations in an area. An ecosystem includes the community plus its physical environment. Food chains show energy flow — energy decreases at each trophic level. Only about ten percent of energy passes to the next level. Nutrient cycles include the carbon, nitrogen, and water cycles. Biodiversity is the variety of life. Hotspots are areas of high biodiversity and endemism. Threats include habitat destruction, invasive species, pollution, and climate change. Conservation strategies: in situ and ex situ. The ozone layer depletion, acid rain, and global warming are major environmental issues.' },
    ],
  },

  'General Science': {
    elementary: [
      { title: 'Ch 1: Plants and Animals', text: 'Plants and animals are living things. They need food, water, air, and space to live. Plants make their own food using sunlight, water, and air. This is called photosynthesis. Plants have roots, stems, leaves, flowers, and fruits. Roots hold the plant in the soil and absorb water. Leaves capture sunlight. Flowers help in reproduction. Animals cannot make their own food. They eat plants or other animals. Animals have different ways of moving — some walk, some fly, some swim. Birds have wings and feathers. Fish have fins and gills. Plants and animals depend on each other. Animals breathe in oxygen released by plants. Plants use carbon dioxide breathed out by animals.' },
      { title: 'Ch 2: Our Body', text: 'Our body has many parts that work together. The skeleton gives us shape and protects our organs. Bones are joined at joints. Muscles help us move. The heart pumps blood throughout the body. Blood carries food and oxygen to all parts. The lungs help us breathe. We breathe in oxygen and breathe out carbon dioxide. The brain controls all activities. The five senses — sight, hearing, smell, taste, and touch — help us understand the world. Eyes help us see. Ears help us hear. The nose helps us smell. The tongue helps us taste. Skin helps us feel touch, heat, and cold. We should eat healthy food, exercise, sleep well, and keep clean to stay healthy.' },
      { title: 'Ch 3: Food and Health', text: 'We eat food to get energy and to grow. Different foods give us different nutrients. Carbohydrates in rice, bread, and potatoes give us energy. Proteins in dal, eggs, and milk help us grow and repair our body. Fats in butter and oil give us energy and keep us warm. Vitamins and minerals keep us healthy. Fruits and vegetables are rich in vitamins. Milk and dairy products are rich in calcium for strong bones. A balanced diet includes all food groups. We should eat meals at regular times. Drinking clean water is very important. We should wash our hands before eating and after using the toilet. Exercise keeps our body strong and healthy.' },
    ],
    middle: [
      { title: 'Ch 1: Materials and Their Properties', text: 'Everything around us is made of materials. Materials can be natural or synthetic. Natural materials come from nature — wood, cotton, wool, silk, clay, and metals. Synthetic materials are made by humans — nylon, polyester, plastic, and glass. Materials have different properties. Hardness tells us how difficult it is to scratch a material. Solubility tells us whether a material dissolves in water. Transparency tells us whether light passes through. Conductivity tells us whether heat or electricity passes through. Metals are generally hard, shiny, and good conductors. Non-metals are generally poor conductors. Materials are chosen for specific uses based on their properties.' },
      { title: 'Ch 2: Physical and Chemical Changes', text: 'A physical change alters the form of a substance without changing its chemical composition. Melting ice into water, tearing paper, and dissolving sugar in water are physical changes. The original substance can usually be recovered. A chemical change produces one or more new substances with different properties. Burning, rusting, cooking, and curdling of milk are chemical changes. Signs of a chemical change include change in colour, production of gas, formation of precipitate, change in temperature, and change in smell. Once a chemical change occurs, it is usually difficult to reverse. Rusting of iron is a slow chemical change — iron reacts with oxygen and water to form iron oxide.' },
      { title: 'Ch 3: Living World and Environment', text: 'Living things share characteristics — they grow, reproduce, respire, excrete, and respond to stimuli. Classification helps us study the variety of life. Carolus Linnaeus developed the modern system. The major kingdoms are Monera, Protista, Fungi, Plantae, and Animalia. Food chains show feeding relationships. Grass is eaten by grasshoppers, which are eaten by frogs, which are eaten by snakes, which are eaten by eagles. Energy flows through food chains. Decomposers break down dead matter and return nutrients to the soil. Ecosystems include forests, grasslands, deserts, and aquatic systems. Pollution, deforestation, and climate change are major threats to ecosystems.' },
    ],
    secondary: [
      { title: 'Ch 1: Chemical Substances', text: 'Acids have a sour taste, turn blue litmus red, and have pH less than seven. Bases feel soapy, turn red litmus blue, and have pH greater than seven. The pH scale measures acidity and alkalinity. pH seven is neutral. Salts are formed when acids and bases react in a neutralisation reaction. The pH of soil affects crop growth. Acids like hydrochloric acid, sulphuric acid, and nitric acid are important in industry. Bases like sodium hydroxide and calcium hydroxide are used in soap making and agriculture. Indicators like litmus, phenolphthalein, and methyl orange show whether a substance is acid or base. Universal indicators show the exact pH.' },
      { title: 'Ch 2: Metals and Non-Metals', text: 'Metals are shiny, malleable, ductile, and good conductors of heat and electricity. Most metals are solid at room temperature. Mercury is a liquid metal. Sodium and potassium are so reactive they must be stored in oil. The reactivity series ranks metals by their tendency to react. More reactive metals displace less reactive metals from their compounds. Corrosion is the slow destruction of metals by chemical reactions. Rusting is the corrosion of iron. Non-metals are mostly poor conductors. Carbon, sulphur, phosphorus, and the halogens are non-metals. Alloys are mixtures of metals. Steel is an alloy of iron and carbon. Brass is copper and zinc. Bronze is copper and tin.' },
      { title: 'Ch 3: Our Environment', text: 'The environment includes all living and non-living things around us. An ecosystem has biotic and abiotic components. Biotic components are living organisms. Abiotic components are non-living factors like sunlight, water, soil, and temperature. Producers convert solar energy to chemical energy. Consumers eat other organisms. Decomposers break down dead matter. Ozone in the stratosphere absorbs harmful ultraviolet radiation. The ozone layer is being depleted by chlorofluorocarbons. The greenhouse effect is the warming caused by gases trapping heat. Global warming is causing climate change, rising sea levels, and loss of biodiversity. Waste management through reduce, reuse, and recycle is essential.' },
    ],
  },

  History: {
    middle: [
      { title: 'Ch 1: What is History?', text: 'History is the study of the past. We learn about people, events, and changes over time. Sources of history include written documents, inscriptions, coins, pottery, buildings, and oral traditions. Primary sources are original records from the time being studied. Secondary sources are accounts written later based on primary sources. Historians interpret evidence to reconstruct the past. Chronology — the ordering of events in time — is fundamental to history. We use dates and eras like BCE Before Common Era and CE Common Era. Archaeological excavations uncover physical remains of the past. Historians ask questions: What happened? When? Where? Who was involved? Why did it happen? What were the consequences?' },
      { title: 'Ch 2: Ancient Civilisations', text: 'The earliest human civilisations developed near rivers. The Indus Valley Civilisation flourished around five thousand years ago in the region of present-day Pakistan and northwest India. Major sites include Mohenjo-daro and Harappa. These cities had planned streets, drainage systems, and standardised weights. The Mesopotamian civilisation developed between the Tigris and Euphrates rivers. Ancient Egypt developed along the Nile. Ancient China developed along the Yellow River. These civilisations developed writing, laws, trade, and complex societies. The Vedic period in India saw the composition of the Vedas, the oldest Hindu scriptures. Iron technology transformed agriculture and warfare.' },
      { title: 'Ch 3: Empires and Kingdoms', text: 'The Maurya Empire was the first great empire of India. Chandragupta Maurya founded it around 321 BCE. His grandson Ashoka expanded the empire to cover most of the subcontinent. After the Kalinga war, Ashoka converted to Buddhism and promoted ahimsa, non-violence. He spread Buddhism through missionaries and inscribed his edicts on rocks and pillars. The Gupta Empire is called the Golden Age of India for its achievements in science, mathematics, astronomy, art, and literature. Aryabhata calculated pi and proposed the heliocentric theory. Kalidasa wrote Shakuntala and Meghaduta. The Silk Road connected India to China, Persia, and Rome through trade.' },
    ],
    secondary: [
      { title: 'Ch 1: The French Revolution', text: 'The French Revolution began in 1789 and radically transformed France and influenced the world. France was under the absolute rule of King Louis XVI. Society was divided into three estates: the clergy, the nobility, and the commoners. The Third Estate faced heavy taxes while nobles were exempt. Enlightenment ideas of liberty, equality, and fraternity inspired demands for change. The Estates General was called to address the financial crisis. The Third Estate formed the National Assembly. The storming of the Bastille on 14 July 1789 symbolised the Revolution. The Declaration of the Rights of Man proclaimed natural rights. The revolutionary government executed the king and queen. The Reign of Terror killed thousands. Napoleon Bonaparte rose from the chaos.' },
      { title: 'Ch 2: Nationalism and Colonialism', text: 'Nationalism is the idea that people sharing a common culture, language, or history should form a nation-state. In Europe, nationalism led to the unification of Germany and Italy in the 19th century. Colonialism is the domination of one country by another. European powers colonised vast territories in Asia, Africa, and the Americas. The British East India Company began trading in India in the early 17th century and gradually took political control. The 1857 uprising, called the First War of Independence by some, challenged British rule. After 1858, the British Crown took direct control. Colonial rule transformed Indian economy, agriculture, education, and society.' },
      { title: 'Ch 3: The World Wars', text: 'World War One began in 1914 and lasted until 1918. The assassination of Archduke Franz Ferdinand of Austria-Hungary by a Bosnian Serb triggered a chain of events. Alliance systems drew nations into the conflict. The war was characterised by trench warfare, poison gas, and enormous casualties. The Treaty of Versailles imposed harsh terms on Germany. Economic hardship and resentment contributed to the rise of Adolf Hitler and the Nazi party. World War Two began in 1939 when Germany invaded Poland. Germany occupied much of Europe. Japan attacked Pearl Harbor in 1941, drawing the United States into the war. The Holocaust was the systematic murder of six million Jews. The war ended in 1945 with Allied victory and the use of atomic bombs on Japan.' },
    ],
  },

  Economics: {
    secondary: [
      { title: 'Ch 1: Development', text: 'Development means improvement in human life and well-being. Different people have different goals for development. A farmer wants a good harvest. A student wants quality education. A woman wants safety and equal opportunities. Countries are compared using income, health, and education indicators. Per capita income is national income divided by population. The Human Development Index combines life expectancy, education, and income. Countries above 0.8 are in the high human development group. India is in the medium development group. Development should be sustainable — meeting today\'s needs without compromising future generations\' ability to meet their needs. Overuse of natural resources, environmental damage, and pollution undermine sustainable development.' },
      { title: 'Ch 2: Indian Economy', text: 'India has a mixed economy combining elements of both market and planned economies. The economy has three sectors: primary, secondary, and tertiary. Agriculture, forestry, and fishing are primary sector activities and employ the largest share of India\'s workforce. Manufacturing, construction, and mining are secondary sector activities. Services like trade, transport, banking, education, and healthcare are tertiary sector activities. The service sector contributes the most to India\'s GDP. NREGA, the National Rural Employment Guarantee Act, guarantees 100 days of employment to rural households. The Green Revolution transformed Indian agriculture through high-yield variety seeds, irrigation, and fertilisers. India is now self-sufficient in food grain production.' },
    ],
  },

  English: {
    secondary: [
      { title: 'Ch 1: Reading and Comprehension', text: 'Reading comprehension is the ability to understand what you read. Active reading means engaging with the text — asking questions, making predictions, and connecting to what you already know. Skimming involves reading quickly for the general idea. Scanning involves looking for specific information. Inference means understanding what is implied but not directly stated. The main idea is the central message of a passage. Supporting details provide evidence. Vocabulary in context means using surrounding words and sentences to understand unfamiliar words. Literature includes prose, poetry, and drama. A story has plot, characters, setting, theme, and point of view. A poem uses rhythm, rhyme, imagery, and figures of speech.' },
      { title: 'Ch 2: Grammar', text: 'Parts of speech classify words by their function. Nouns name people, places, things, and ideas. Pronouns replace nouns. Verbs show action or state of being. Adjectives describe nouns. Adverbs modify verbs, adjectives, or other adverbs. Prepositions show relationships. Conjunctions join words, phrases, or clauses. A clause has a subject and predicate. An independent clause can stand alone. A dependent clause cannot. A sentence expresses a complete thought. Tenses show time: present, past, and future. The passive voice reverses subject and object: the active sentence the dog chased the cat becomes the passive sentence the cat was chased by the dog. Direct and indirect speech have different rules for tense and pronoun changes.' },
    ],
  },

  Hindi: {
    general: [
      { title: 'अध्याय 1: हिंदी भाषा', text: 'हिंदी भारत की राजभाषा है। यह देवनागरी लिपि में लिखी जाती है। हिंदी संस्कृत से विकसित हुई है। इसमें बावन वर्णमाला है जिसमें स्वर और व्यंजन शामिल हैं। हिंदी में शब्दों के दो लिंग होते हैं — पुल्लिंग और स्त्रीलिंग। वचन दो प्रकार के होते हैं — एकवचन और बहुवचन। हिंदी में तीन काल होते हैं — भूतकाल, वर्तमानकाल और भविष्यकाल। हिंदी साहित्य बहुत समृद्ध है। कबीरदास, तुलसीदास, मीराबाई और सूरदास जैसे महान कवियों ने हिंदी को अमर किया। आधुनिक हिंदी साहित्य में मुंशी प्रेमचंद का विशेष स्थान है।' },
      { title: 'अध्याय 2: कविता और गद्य', text: 'कविता भावनाओं की काव्यात्मक अभिव्यक्ति है। कविता में लय, ताल, तुकबंदी और भाव होते हैं। छंद कविता की विशेष संरचना को कहते हैं। दोहा दो पंक्तियों का छंद है। चौपाई चार पंक्तियों का छंद है। रस कविता में भाव की अनुभूति है। नौ रस हैं — शृंगार, हास्य, करुण, रौद्र, वीर, भयानक, बीभत्स, अद्भुत और शांत। गद्य में कहानी, उपन्यास, निबंध और नाटक आते हैं। निबंध किसी विषय पर विचारपूर्ण रचना है। कहानी में पात्र, घटना, संवाद और कथानक होते हैं। नाटक मंच पर प्रस्तुत किया जाता है।' },
    ],
  },

  'Computer Science': {
    middle: [
      { title: 'Ch 1: Introduction to Computers', text: 'A computer is an electronic machine that processes data. It takes input, processes it, and gives output. The main parts of a computer are the monitor, keyboard, mouse, CPU, and memory. The CPU or central processing unit is the brain of the computer. RAM stands for Random Access Memory and stores data that is currently being used. ROM stands for Read Only Memory and stores permanent data. Hard disk and pen drives store data permanently. Input devices: keyboard, mouse, scanner, microphone. Output devices: monitor, printer, speakers. The operating system manages all hardware and software. Windows, Mac OS, and Linux are popular operating systems.' },
      { title: 'Ch 2: Software and Applications', text: 'Software is a set of instructions that tells the computer what to do. System software manages the computer\'s hardware and basic functions. The operating system is the most important system software. Application software performs specific tasks for users. Microsoft Word is used for writing documents. Excel for spreadsheets and calculations. PowerPoint for presentations. Browsers like Chrome and Firefox are used to access the internet. The internet is a global network of connected computers. Email allows us to send and receive messages electronically. We should be safe online — protect personal information, never talk to strangers, and tell a trusted adult if something online makes us uncomfortable.' },
    ],
    secondary: [
      { title: 'Ch 1: Introduction to Python', text: 'Python is a high-level, interpreted, general-purpose programming language known for its clear, readable syntax. It was created by Guido van Rossum and first released in 1991. Python uses indentation to define code blocks. Variables store data and are created by assignment: name equals value. Python has several data types: integers for whole numbers, floats for decimals, strings for text enclosed in quotes, and booleans for True or False. The print function displays output. The input function reads user input. Comments start with a hash and are ignored by the interpreter. Python programs are executed line by line from top to bottom unless control structures change the flow.' },
      { title: 'Ch 2: Control Structures', text: 'Control structures determine the order in which instructions are executed. The if statement executes a block of code only if a condition is True. The if-else statement provides an alternative block. The if-elif-else chain handles multiple conditions. Comparison operators: double equals for equality, not equals, greater than, less than, greater than or equal, less than or equal. Logical operators: and, or, not. The for loop repeats a block a fixed number of times. The range function generates a sequence of numbers. The while loop repeats as long as a condition is True. The break statement exits a loop early. The continue statement skips the rest of the current iteration. Loops can be nested.' },
      { title: 'Ch 3: Functions and Modules', text: 'A function is a named block of reusable code. We define a function using the def keyword. Parameters are inputs to the function. A return statement sends a value back to the caller. Functions make code modular, readable, and reusable. Built-in functions like len, type, int, float, str, and print are always available. Modules are files containing Python code. We import modules using the import statement. The math module has mathematical functions. The random module generates random numbers. The datetime module handles dates and times. Creating our own modules helps organise large programs. Recursive functions call themselves to solve problems that can be broken into smaller identical sub-problems.' },
    ],
    higher: [
      { title: 'Ch 1: Data Structures', text: 'A data structure organises and stores data efficiently. Lists in Python are ordered, mutable collections. List methods: append, remove, pop, sort, reverse. Tuples are ordered but immutable. Dictionaries store key-value pairs — like a real-world dictionary where you look up a word to get its meaning. Dictionary methods: keys, values, items, get. Sets are unordered collections of unique elements. Stack is a last-in first-out structure. Queue is a first-in first-out structure. Linked lists store elements as nodes with pointers to the next node. Trees are hierarchical structures. Binary trees have at most two children per node. Algorithms that search and sort data use these structures.' },
      { title: 'Ch 2: Database Concepts', text: 'A database is an organised collection of structured data. A relational database stores data in tables with rows and columns. Each row is a record. Each column is a field. A primary key uniquely identifies each record. A foreign key links tables. SQL — Structured Query Language — is used to interact with relational databases. SELECT retrieves data. INSERT adds new records. UPDATE modifies records. DELETE removes records. WHERE clause filters records. JOIN combines data from multiple tables. Database normalisation reduces redundancy. Transactions ensure data consistency. ACID properties — atomicity, consistency, isolation, durability — guarantee reliable transactions. SQLite is a simple database used for learning.' },
    ],
  },
}

const FALLBACK: Chapter[] = [
  { title: 'Ch 1: Introduction', text: 'This book introduces the fundamental concepts of the subject. Students will explore the basic principles that form the foundation for advanced study. Each chapter builds on the previous, creating a structured learning journey.' },
  { title: 'Ch 2: Core Concepts', text: 'The core concepts of this subject are essential for understanding the world around us. Through careful study and practice, students develop the ability to analyse problems, apply principles, and arrive at well-reasoned conclusions.' },
  { title: 'Ch 3: Applications', text: 'Knowledge becomes meaningful when applied to real situations. This section explores how the theoretical concepts of this subject are used in everyday life, industry, research, and further academic study.' },
]

function getChapters(book: Book): Chapter[] {
  const level = getLevel(book.class)
  const subjectMap = CHAPTERS[book.subject]
  if (!subjectMap) return FALLBACK
  return subjectMap[level] || subjectMap['general'] || subjectMap['secondary'] || subjectMap['higher'] || Object.values(subjectMap)[0] || FALLBACK
}

/* ═══════════════════════════════════════════════════════
   BOOKMARK SYSTEM
   ═══════════════════════════════════════════════════════ */
interface Bookmark {
  id: string
  bookId: number
  bookTitle: string
  label: string
  chapterIdx: number
  charOffset: number
  pct: number
  createdAt: number
}

const BM_KEY = 'curioushat_bookmarks'

function loadBookmarks(bookId: number): Bookmark[] {
  try {
    const all: Bookmark[] = JSON.parse(localStorage.getItem(BM_KEY) || '[]')
    return all.filter(b => b.bookId === bookId).sort((a, b) => b.createdAt - a.createdAt)
  } catch { return [] }
}

function saveBookmark(bm: Bookmark) {
  try {
    const all: Bookmark[] = JSON.parse(localStorage.getItem(BM_KEY) || '[]')
    // Max 10 bookmarks per book
    const others = all.filter(b => b.bookId !== bm.bookId)
    const forBook = all.filter(b => b.bookId === bm.bookId).slice(0, 9)
    localStorage.setItem(BM_KEY, JSON.stringify([...others, ...forBook, bm]))
  } catch {}
}

function deleteBookmark(id: string) {
  try {
    const all: Bookmark[] = JSON.parse(localStorage.getItem(BM_KEY) || '[]')
    localStorage.setItem(BM_KEY, JSON.stringify(all.filter(b => b.id !== id)))
  } catch {}
}

/* ═══════════════════════════════════════════════════════
   SPEED OPTIONS
   ═══════════════════════════════════════════════════════ */
const SPEEDS = [0.75, 1, 1.25, 1.5, 2]

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
interface Props { book: Book; onClose: () => void }

export default function AudioBookPlayer({ book, onClose }: Props) {
  const [chapters] = useState<Chapter[]>(() => getChapters(book))
  const [chapterIdx, setChapterIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceIdx, setVoiceIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [showChapters, setShowChapters] = useState(false)
  const [showVoices, setShowVoices] = useState(false)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => loadBookmarks(book.id))
  const [bmSaved, setBmSaved] = useState(false)

  const charOffsetRef = useRef(0)
  const totalCharsRef = useRef(chapters[0]?.text.length || 1)

  /* ── Load voices ── */
  useEffect(() => {
    const load = () => {
      const v = window.speechSynthesis.getVoices()
      if (!v.length) return
      const sorted = [
        ...v.filter(x => x.lang.startsWith('hi')),
        ...v.filter(x => x.lang.includes('IN')),
        ...v.filter(x => x.lang.startsWith('en') && !x.lang.includes('IN')),
        ...v.filter(x => !x.lang.startsWith('en') && !x.lang.includes('IN') && !x.lang.startsWith('hi')),
      ]
      setVoices(sorted)
    }
    load()
    window.speechSynthesis.onvoiceschanged = load
    return () => { window.speechSynthesis.onvoiceschanged = null }
  }, [])

  useEffect(() => () => { window.speechSynthesis.cancel() }, [])

  /* ── Speak from char offset ── */
  const speak = useCallback((fromChar: number, chIdx: number, spd: number, vIdx: number) => {
    window.speechSynthesis.cancel()
    const text = chapters[chIdx]?.text || ''
    totalCharsRef.current = text.length
    const slice = text.slice(fromChar)
    if (!slice.trim()) return

    const utt = new SpeechSynthesisUtterance(slice)
    utt.rate = spd
    if (voices[vIdx]) utt.voice = voices[vIdx]
    utt.onboundary = (e) => {
      if (e.name === 'word') {
        const abs = fromChar + e.charIndex
        charOffsetRef.current = abs
        setElapsed(abs)
        setProgress(abs / totalCharsRef.current)
      }
    }
    utt.onend = () => {
      charOffsetRef.current = 0; setElapsed(0); setProgress(0)
      if (chIdx < chapters.length - 1) {
        const next = chIdx + 1
        setChapterIdx(next)
        speak(0, next, spd, vIdx)
      } else { setPlaying(false) }
    }
    utt.onerror = () => setPlaying(false)
    window.speechSynthesis.speak(utt)
    setPlaying(true)
  }, [chapters, voices])

  const handlePlay = () => {
    if (playing) { window.speechSynthesis.cancel(); setPlaying(false) }
    else speak(charOffsetRef.current, chapterIdx, speed, voiceIdx)
  }

  const handleChapter = (idx: number) => {
    window.speechSynthesis.cancel()
    charOffsetRef.current = 0; setElapsed(0); setProgress(0)
    setChapterIdx(idx); setShowChapters(false)
    if (playing) speak(0, idx, speed, voiceIdx)
    else setPlaying(false)
  }

  const handlePrev = () => handleChapter(Math.max(0, chapterIdx - 1))
  const handleNext = () => handleChapter(Math.min(chapters.length - 1, chapterIdx + 1))

  const handleSpeed = (s: number) => {
    setSpeed(s)
    if (playing) { const p = charOffsetRef.current; window.speechSynthesis.cancel(); speak(p, chapterIdx, s, voiceIdx) }
  }

  const handleVoice = (idx: number) => {
    setVoiceIdx(idx); setShowVoices(false)
    if (playing) { const p = charOffsetRef.current; window.speechSynthesis.cancel(); speak(p, chapterIdx, speed, idx) }
  }

  const handleRestart = () => {
    window.speechSynthesis.cancel(); charOffsetRef.current = 0; setElapsed(0); setProgress(0)
    if (playing) speak(0, chapterIdx, speed, voiceIdx)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const newChar = Math.floor(ratio * chapters[chapterIdx].text.length)
    charOffsetRef.current = newChar; setElapsed(newChar); setProgress(ratio)
    if (playing) { window.speechSynthesis.cancel(); speak(newChar, chapterIdx, speed, voiceIdx) }
  }

  /* ── Bookmark: save current position ── */
  const handleAddBookmark = () => {
    const ch = chapters[chapterIdx]
    const bm: Bookmark = {
      id: Date.now().toString(),
      bookId: book.id,
      bookTitle: book.title,
      label: `${ch.title} · ${fmt(estDone)}`,
      chapterIdx,
      charOffset: charOffsetRef.current,
      pct: Math.round(progress * 100),
      createdAt: Date.now(),
    }
    saveBookmark(bm)
    setBookmarks(loadBookmarks(book.id))
    setBmSaved(true)
    setTimeout(() => setBmSaved(false), 1800)
  }

  /* ── Resume from bookmark ── */
  const handleResumeBookmark = (bm: Bookmark) => {
    window.speechSynthesis.cancel()
    charOffsetRef.current = bm.charOffset
    setElapsed(bm.charOffset)
    setProgress(bm.pct / 100)
    setChapterIdx(bm.chapterIdx)
    setShowChapters(false)
    speak(bm.charOffset, bm.chapterIdx, speed, voiceIdx)
  }

  const handleDeleteBookmark = (id: string) => {
    deleteBookmark(id)
    setBookmarks(loadBookmarks(book.id))
  }

  /* ── Helpers ── */
  const color = SUBJECT_COLOR[book.subject] || '#6B7280'
  const pct = Math.round(progress * 100)
  const totalChar = chapters[chapterIdx]?.text.length || 1
  const estTotal = Math.round(totalChar / (14 * speed))
  const estDone = Math.round(elapsed / (14 * speed))
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[55] flex flex-col" role="region" aria-label="Audiobook player">

      {/* ── Chapter + Bookmark drawer ── */}
      {showChapters && (
        <div className="bg-white border-t border-gray-200 shadow-lg max-h-72 overflow-y-auto">
          <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide flex-1">Chapters · {book.title}</p>
            <button onClick={() => setShowChapters(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>

          {/* Bookmarks section */}
          {bookmarks.length > 0 && (
            <div className="border-b border-gray-100 bg-amber-50">
              <p className="px-4 pt-2 pb-1 text-[10px] font-bold text-amber-700 uppercase tracking-wide flex items-center gap-1">
                <Bookmark className="w-3 h-3" /> Saved Bookmarks
              </p>
              {bookmarks.map(bm => (
                <div key={bm.id} className="flex items-center gap-2 px-4 py-2 hover:bg-amber-100 transition-colors">
                  <button onClick={() => handleResumeBookmark(bm)} className="flex-1 text-left">
                    <p className="text-xs font-medium text-amber-800 truncate">{bm.label}</p>
                    <p className="text-[10px] text-amber-600">{new Date(bm.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  </button>
                  <button onClick={() => handleDeleteBookmark(bm.id)} className="p-1 text-amber-400 hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Chapter list */}
          {chapters.map((ch, i) => (
            <button key={i} onClick={() => handleChapter(i)}
              className={`w-full text-left px-4 py-2.5 flex items-center gap-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === chapterIdx ? 'bg-violet-50' : ''}`}>
              {i === chapterIdx && playing
                ? <span className="flex items-end gap-0.5 w-4 flex-shrink-0">{[4, 7, 5].map((h, k) => <span key={k} className="w-0.5 rounded-full bg-violet-500 animate-pulse" style={{ height: h * 2 }} />)}</span>
                : <span className="text-xs text-gray-400 w-4 flex-shrink-0">{i + 1}</span>}
              <span className={`text-xs truncate ${i === chapterIdx ? 'text-violet-700 font-semibold' : 'text-gray-700'}`}>{ch.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Voice drawer ── */}
      {showVoices && voices.length > 0 && (
        <div className="bg-white border-t border-gray-200 shadow-lg max-h-48 overflow-y-auto">
          <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Select Voice</p>
            <button onClick={() => setShowVoices(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>
          {voices.map((v, i) => (
            <button key={i} onClick={() => handleVoice(i)}
              className={`w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors ${i === voiceIdx ? 'bg-violet-50 text-violet-700 font-medium' : 'text-gray-700'}`}>
              <Volume2 className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
              <span className="text-xs truncate">{v.name}</span>
              <span className="ml-auto text-[10px] text-gray-400">{v.lang}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Main player bar ── */}
      <div className="bg-white border-t border-gray-200 shadow-2xl px-3 sm:px-4 py-2 sm:py-3" style={{ borderTop: `3px solid ${color}` }}>

        {/* Progress bar */}
        <div className="mb-2 group cursor-pointer" onClick={handleProgressClick} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Playback progress">
          <div className="h-1.5 bg-gray-100 rounded-full relative">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2" style={{ left: `${pct}%`, borderColor: color }} />
          </div>
          <div className="flex justify-between mt-0.5">
            <span className="text-[10px] text-gray-400">{fmt(estDone)}</span>
            <span className="text-[10px] text-gray-400 font-medium">{chapters[chapterIdx]?.title}</span>
            <span className="text-[10px] text-gray-400">{fmt(estTotal)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">

          {/* Book info — sm+ only */}
          <div className="hidden sm:flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '18', border: `2px solid ${color}30` }}>
              <Headphones className="w-4 h-4" style={{ color }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate leading-tight">{book.title}</p>
              <p className="text-[10px] text-gray-400 truncate">{book.class} · {book.author}</p>
            </div>
          </div>

          {/* Chapter / bookmark toggle */}
          <button onClick={() => { setShowChapters(v => !v); setShowVoices(false) }}
            className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-violet-600 border border-gray-200 rounded-lg px-2 py-1.5 transition-colors flex-shrink-0 relative">
            <BookOpen className="w-3.5 h-3.5" />
            <ChevronUp className={`w-3 h-3 transition-transform ${showChapters ? '' : 'rotate-180'}`} />
            {bookmarks.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{ backgroundColor: color }}>
                {bookmarks.length}
              </span>
            )}
          </button>

          {/* Playback controls */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={handlePrev} disabled={chapterIdx === 0} aria-label="Previous chapter"
              className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors">
              <SkipBack className="w-4 h-4" />
            </button>
            <button onClick={handlePlay} aria-label={playing ? 'Pause' : 'Play'}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: color }}>
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
            </button>
            <button onClick={handleNext} disabled={chapterIdx === chapters.length - 1} aria-label="Next chapter"
              className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Restart */}
          <button onClick={handleRestart} aria-label="Restart chapter" className="hidden sm:block p-1.5 text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Bookmark save button */}
          <button onClick={handleAddBookmark} aria-label="Save bookmark"
            className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${bmSaved ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'}`}>
            {bmSaved ? <BookMarked className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          {/* Speed */}
          <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5 overflow-x-auto flex-shrink-0">
            {SPEEDS.map(s => (
              <button key={s} onClick={() => handleSpeed(s)}
                className={`text-[10px] font-bold px-1.5 py-1 rounded-md transition-all whitespace-nowrap flex-shrink-0 ${speed === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                {s}×
              </button>
            ))}
          </div>

          {/* Voice */}
          {voices.length > 0 && (
            <button onClick={() => { setShowVoices(v => !v); setShowChapters(false) }}
              className="hidden sm:flex items-center gap-1 text-[10px] text-gray-500 hover:text-violet-600 border border-gray-200 rounded-lg px-2 py-1.5 transition-colors flex-shrink-0">
              <Volume2 className="w-3 h-3" />
              <ChevronDown className="w-3 h-3" />
            </button>
          )}

          <button onClick={onClose} aria-label="Close player"
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

const SUBJECT_COLOR: Record<string, string> = {
  Mathematics: '#4F46E5', Physics: '#0891B2', Chemistry: '#059669',
  Biology: '#7C3AED', English: '#D97706', History: '#B45309',
  Geography: '#0D9488', Economics: '#1D4ED8', 'Computer Science': '#BE185D',
  'General Science': '#DC2626', Commerce: '#F59E0B', 'The Arts': '#EC4899',
  'Political Science': '#6D28D9', 'Regional Languages': '#065F46',
  Sociology: '#7C3AED', Psychology: '#1D4ED8', Hindi: '#DC2626',
}
