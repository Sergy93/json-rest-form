using ServicioAlumnos.Models;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;

namespace ServicioAlumnos.Controllers
{
    public class AlumnosController : ApiController
    {
        private readonly ajaxEntities _db = new ajaxEntities();

        // GET: api/alumnos
        public IQueryable<alumnos> Getalumnos()
        {
            return _db.alumnos;
        }

        // GET: api/alumnos/5
        [ResponseType(typeof(alumnos))]
        public IHttpActionResult Getalumnos(int id)
        {
            alumnos alumnos = _db.alumnos.Find(id);
            if (alumnos == null)
            {
                return NotFound();
            }

            return Ok(alumnos);
        }

        // PUT: api/alumnos/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Putalumnos(int id, alumnos alumnos)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != alumnos.id)
            {
                return BadRequest();
            }

            _db.Entry(alumnos).State = EntityState.Modified;

            try
            {
                _db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AlumnosExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/alumnos
        [ResponseType(typeof(alumnos))]
        public IHttpActionResult Postalumnos(alumnos alumnos)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _db.alumnos.Add(alumnos);
            _db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { alumnos.id }, alumnos);
        }

        // DELETE: api/alumnos/5
        [ResponseType(typeof(alumnos))]
        public IHttpActionResult Deletealumnos(int id)
        {
            alumnos alumnos = _db.alumnos.Find(id);
            if (alumnos == null)
            {
                return NotFound();
            }

            _db.alumnos.Remove(alumnos);
            _db.SaveChanges();

            return Ok(alumnos);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AlumnosExists(int id)
        {
            return _db.alumnos.Count(e => e.id == id) > 0;
        }
    }
}