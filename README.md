# Diffusion-Explainer

Diffusion Explainer is an interactive visualization tool designed to help anyone learn how Stable Diffusion transforms text prompts into images.
It runs in your browser, allowing you to experiment with several preset prompts without any installation, coding skills, or GPUs.
Try Diffusion Explainer at https://poloclub.github.io/diffusion-explainer and watch a demo video on YouTube https://youtu.be/Zg4gxdIWDds!


[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![arxiv badge](https://img.shields.io/badge/arXiv-2305.03509-red)](https://arxiv.org/abs/2305.03509)
<!-- ![crown_jewel]() -->

<table>
<tr>
    <td colspan="4"><video width="100%" src="https://github.com/poloclub/diffusion-explainer/assets/43836461/72974e4c-0a5e-436f-b7a1-89de0500bce1"></td>
</tr>
<tr>
    <td><a href="http://poloclub.github.io/diffusion-explainer">🚀 Live Demo</a></td>
    <td><a href="https://youtu.be/Zg4gxdIWDds">📺 Demo Video</a></td>
    <td><a href="https://arxiv.org/abs/2305.03509">📜 Research Paper</a></td>
    <td><a href="https://medium.com/@seongminleee/77b53f4f1c4">📄 Blog Post</a></td>
</tr>
</table>

### Research Paper
[**Diffusion Explainer: Visual Explanation for Text-to-image Stable Diffusion**](https://arxiv.org/abs/2305.03509).
Seongmin Lee, Benjamin Hoover, Hendrik Strobelt, Zijie J. Wang, ShengYun Peng, Austin Wright, Kevin Li, Haekyu Park, Haoyang Yang, Duen Horng Chau.
Short paper, IEEE VIS 2024.

## How to run locally
```
git clone https://github.com/poloclub/diffusion-explainer.git
cd diffusion-explainer
python -m http.server 8000
```

Then, on your web browser, access http://localhost:8000.
You can replace 8000 with other port numbers you want to use.

## Credits
Led by [Seongmin Lee](http://www.seongmin.xyz),
Diffusion Explainer is created by Machine Learning and Human-computer Interaction researchers at Georgia Tech and IBM Research.
The team includes
[Seongmin Lee](http://www.seongmin.xyz),
[Benjamin Hoover](https://bhoov.com),
[Hendrik Strobelt](http://hendrik.strobelt.com),
[Jay Wang](https://zijie.wang),
[ShengYun (Anthony) Peng](https://shengyun-peng.github.io),
[Austin Wright](https://www.austinpwright.com),
[Kevin Li](https://www.linkedin.com/in/kevinyli/),
[Haekyu Park](https://haekyu.github.io/),
[Alex Yang](https://alexanderyang.me/),
and [Polo Chau](http://www.cc.gatech.edu/~dchau/).

## Citation

```bibTeX
@article{lee2024diffusion,
  title = {{D}iffusion {E}xplainer: {V}isual {E}xplanation for {T}ext-to-image {S}table {D}iffusion},
  shorttitle = {Diffusion Explainer},
  author = {Lee, Seongmin and Hoover, Benjamin and Strobelt, Hendrik and Wang, Zijie J and Peng, ShengYun and Wright, Austin and Li, Kevin and Park, Haekyu and Yang, Haoyang and Chau, Duen Horng},
  journal={IEEE VIS},
  year={2024}
}
```

## License
The software is available under the [MIT License](https://github.com/poloclub/diffusion-explainer/blob/main/LICENSE).

## Contact
If you have any questions, feel free to [open an issue](https://github.com/poloclub/diffusion-explainer/issues/new/choose) or contact [Seongmin Lee](http://www.seongmin.xyz/).
