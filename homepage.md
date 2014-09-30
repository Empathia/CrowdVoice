# Introduction


# Index
1. [Problem](#problem)
2. [Requirements](#requirements)
3. [Constraints](#constraints)
4. [Observe](#observe)
5. [Hypothesis](#hypothesis)
6. [Experiments](#experiments)
7. [Dependancies](#dependancies)
8. [Black Box](#black_box)
9. [Theory of Operation](#theory_of_operation_spec)
10. [Functional Spec](#functional_spec)
11. [Technical / Program Spec](#technical_program_spec)
12. [Usage Example](#usage_example)
13. [Notes](#notes)
14. [Sources](#sources)
15. [Questions](#questions)

<a id="problem"></a>
# Problem
  - Users do not have the opportunity of really knowing what CrowdVoice offers besides voices conformed just of media feeds.
  - Poor user experience.


<a href="requirements"></a>
# Requirements
Slice and integrate the <a href="http://cl.ly/image/2y1j232i1P3Y">new home page design</a> for crowdvoice and change the admin part to organize the home page voices elements.

<a href="constraints"></a>
# Constraints
- Responsive is not considered in this phase

- Supported browsers:
  - Firefox
  - Chrome
  - Safari 5 to 6
  - IE9+

- Only 8 voices will be visible on the home page:
  - Featured/Updated voice width: 35%
  - Backstory/Infographic: 55%
  - Gutter: 10%

<a href="hypothesis"></a>
# Hypothesis
- If the new homepage design is more usable, then it will be easier for users to interact with the website and get to know more about infographic and backstories.
- if we integrate the new homepage design we will not need to load all the javascript and css beside all the voices which will result in fast browsing experience when the user open crowdvoice home page.


<a href="experiments"></a>
# Experiments

<a href="dependancies"></a>
# Dependancies

<pre>
          +---------------------+     +---------------+
          | home_layout_builder |&lt;-+-&gt;| voices_object |
          +---------------------+     +---------------+
                                              +
                                              |
                                              |
                                              v
                                       +--------------+
                                       |     Home     |
                                       +--------------+
</pre>

